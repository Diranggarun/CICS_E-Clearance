import { test, expect } from '@playwright/test'
import {
  API_BASE,
  APPROVERS,
  registerStudent,
  apiLogin,
  loginViaUI,
  approveStageViaUI,
} from './helpers.js'

// End-to-end walk through the whole 9-stage clearance pipeline:
//   student request -> Admin -> Cursor -> Department -> BYTES -> Library ->
//   Adviser -> Chairperson -> Dean -> Enrolling Faculty -> PDF
//
// Notes on coverage:
//  - The Admin stage is decided via the API (the Admin area uses a different
//    layout; the API path keeps the test simple). The other eight stages are
//    driven entirely through the UI.
//  - The org-fee stages (Cursor/Department/BYTES) pass without a payment step
//    because the test database seeds no org fees — an org with no configured
//    fee has nothing for the student to settle.
//  - A fresh student is registered for every run, so the test is repeatable
//    without resetting the database.
test.describe('CICS E-Clearance — full clearance flow', () => {
  test('student request through Enrolling Faculty approval and PDF download', async ({
    page,
    browser,
    request,
  }) => {
    test.slow() // nine logins across nine roles — give it room.

    let student
    let requestId

    await test.step('Register a fresh student (API setup)', async () => {
      student = await registerStudent(request)
    })

    await test.step('Student submits a clearance request (UI)', async () => {
      await loginViaUI(page, student.email)
      await page.goto('/student/my-clearance')
      await page
        .getByRole('button', { name: 'Submit Clearance Request' })
        .click()
      // The progress view replaces the empty state once the request exists.
      await expect(page.getByText('0/9 approved')).toBeVisible()
      await expect(
        page.getByRole('heading', { name: 'My Clearance' }),
      ).toBeVisible()
    })

    await test.step('Admin approves stage 1 (API)', async () => {
      const token = await apiLogin(request, APPROVERS.admin)
      const auth = { Authorization: `Bearer ${token}` }

      const pendingRes = await request.get(`${API_BASE}/approval/pending`, {
        headers: auth,
      })
      expect(pendingRes.ok()).toBeTruthy()
      const { pending } = await pendingRes.json()
      const target = pending.find(
        (p) => p.student.school_id === student.schoolId,
      )
      expect(
        target,
        'student request did not appear in the Admin pending queue',
      ).toBeTruthy()
      requestId = target.id

      const approveRes = await request.post(
        `${API_BASE}/approval/${requestId}/approve`,
        {
          headers: auth,
          data: { reason: 'E2E automated approval (Admin stage)' },
        },
      )
      expect(approveRes.ok()).toBeTruthy()
    })

    // Each approver gets a clean browser context so there is no token bleed
    // between roles. Order matters — prerequisites gate every later stage.
    for (const [label, email] of [
      ['Cursor', APPROVERS.cursor],
      ['Department', APPROVERS.department],
      ['BYTES', APPROVERS.bytes],
      ['Librarian', APPROVERS.librarian],
      ['Faculty Adviser', APPROVERS.adviser],
      ['Chairperson', APPROVERS.chairperson],
      ['Dean', APPROVERS.dean],
      ['Enrolling Faculty', APPROVERS.enrolling],
    ]) {
      await test.step(`${label} approves via the UI`, async () => {
        const context = await browser.newContext()
        const approverPage = await context.newPage()
        await loginViaUI(approverPage, email)
        await approveStageViaUI(approverPage, student.schoolId)
        await context.close()
      })
    }

    await test.step('Backend confirms clearance is complete and the PDF generates (API)', async () => {
      const token = await apiLogin(request, student.email)
      const auth = { Authorization: `Bearer ${token}` }

      const meRes = await request.get(`${API_BASE}/clearance/me`, {
        headers: auth,
      })
      expect(meRes.ok()).toBeTruthy()
      const { request: progress } = await meRes.json()
      expect(progress.approved_count).toBe(9)
      expect(progress.status).toBe('completed')

      const pdfRes = await request.get(
        `${API_BASE}/clearance/${requestId}/pdf`,
        { headers: auth },
      )
      expect(pdfRes.ok(), 'gated PDF endpoint should return the file').toBeTruthy()
      expect(pdfRes.headers()['content-type']).toContain('application/pdf')
    })

    await test.step('Student downloads the clearance PDF from My Clearance (UI)', async () => {
      const context = await browser.newContext()
      const studentPage = await context.newPage()
      await loginViaUI(studentPage, student.email)
      await studentPage.goto('/student/my-clearance')

      await expect(studentPage.getByText('9/9 approved')).toBeVisible()
      const downloadBtn = studentPage.getByRole('button', {
        name: /Download PDF/,
      })
      await expect(downloadBtn).toBeEnabled()

      const downloadPromise = studentPage.waitForEvent('download')
      await downloadBtn.click()
      const download = await downloadPromise
      expect(download.suggestedFilename()).toContain('clearance-')

      await context.close()
    })
  })
})
