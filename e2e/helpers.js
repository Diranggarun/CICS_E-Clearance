import { expect } from '@playwright/test'

// The backend API origin. The Vite dev server proxies /api here too, but the
// tests talk to it directly for setup/teardown so they don't depend on the
// proxy.
export const API_BASE = 'http://localhost:5000/api'

// Shared password. The backend currently accepts this for every account (a
// temporary dev bypass in auth.controller.js) and it also satisfies the
// 8-char complexity rule, so it works for freshly registered students too.
export const PASSWORD = 'Cics#2026'

// Seeded approver accounts for the 9-stage pipeline — see backend/prisma/seed.js.
export const APPROVERS = {
  admin: 'admin@cics.edu.ph',
  cursor: 'cursor@cics.edu.ph',
  department: 'department@cics.edu.ph',
  bytes: 'bytesorg@cics.edu.ph',
  librarian: 'librarian@cics.edu.ph',
  adviser: 'adviser@cics.edu.ph',
  chairperson: 'chairperson@cics.edu.ph',
  dean: 'dean@cics.edu.ph',
  enrolling: 'enrolling@cics.edu.ph',
}

// Register a brand-new student through the API so every run starts from a
// clean slate (a student may only ever hold one active clearance request).
export async function registerStudent(request) {
  const stamp = String(Date.now()).slice(-7)
  const student = {
    schoolId: `2026-${stamp}`,
    email: `e2e.student.${stamp}@s.msumain.edu.ph`,
    firstName: 'E2E',
    lastName: `Tester${stamp}`,
    password: PASSWORD,
  }
  const res = await request.post(`${API_BASE}/auth/register`, {
    data: {
      id_number: student.schoolId,
      course: 'BSIT 4A',
      first_name: student.firstName,
      last_name: student.lastName,
      gender: 'Prefer not to say',
      date_of_birth: '2003-01-15',
      contact_number: '09171234567',
      email: student.email,
      password: student.password,
      role: 'student',
    },
  })
  expect(
    res.ok(),
    `registration failed: ${res.status()} ${await res.text()}`,
  ).toBeTruthy()
  return student
}

// API login — returns a bearer token.
export async function apiLogin(request, email, password = PASSWORD) {
  const res = await request.post(`${API_BASE}/auth/login`, {
    data: { email, password },
  })
  expect(res.ok(), `API login failed for ${email}`).toBeTruthy()
  return (await res.json()).access_token
}

// Log in through the real UI and wait for the role's dashboard to load.
export async function loginViaUI(page, email, password = PASSWORD) {
  await page.goto('/login')
  await page.getByPlaceholder('your@cics.edu.ph').fill(email)
  await page.locator('input[type="password"]').fill(password)
  await page.getByRole('button', { name: 'Log in' }).click()
  await page.waitForURL(
    /\/(student|admin|cursor|department|bytes|librarian|adviser|chairperson|dean|enrolling)\//,
    { timeout: 30_000 },
  )
}

// Approve the current role's stage for one student from an ApproverBoard
// dashboard (any of the nine approver roles).
export async function approveStageViaUI(page, schoolId) {
  const row = page.locator('div.grid-cols-6').filter({ hasText: schoolId })
  await expect(row, `no pending request for student ${schoolId}`).toBeVisible()
  await row.getByTitle('Approve').click()

  // ApprovalModal opens — confirm with the Approve button scoped to the modal
  // so the row's own green check icon can never be matched by mistake.
  const modal = page.locator('div.fixed.inset-0.z-50')
  await expect(modal).toBeVisible()
  await modal.getByRole('button', { name: 'Approve', exact: true }).click()

  // Success signals: the modal closes and the decided request leaves the
  // pending queue. A failed approval keeps the modal open with an error toast.
  await expect(modal).toBeHidden()
  await expect(row).toHaveCount(0)
}
