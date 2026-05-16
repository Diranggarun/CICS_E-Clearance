import PDFDocument from 'pdfkit'
import prisma from '../lib/prisma.js'
import { STAGE_ORDER, STAGE_LABELS } from '../lib/clearance.js'

// GET /api/admin/dashboard-stats
export async function dashboardStats(_req, res) {
  const [
    totalStudents,
    pendingAccounts,
    activeRequests,
    completedRequests,
    deniedRequests,
    pendingPayments,
    unpaidFines,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'student' } }),
    prisma.user.count({ where: { status: 'pending' } }),
    prisma.clearanceRequest.count({ where: { status: 'pending' } }),
    prisma.clearanceRequest.count({ where: { status: 'completed' } }),
    prisma.clearanceRequest.count({ where: { status: 'denied' } }),
    prisma.payment.count({ where: { status: 'pending' } }),
    prisma.fine.count({ where: { status: 'unpaid' } }),
  ])

  const stageBreakdown = await Promise.all(
    STAGE_ORDER.map(async (role) => ({
      role,
      label: STAGE_LABELS[role],
      pending: await prisma.clearanceStage.count({ where: { role, status: 'pending' } }),
      approved: await prisma.clearanceStage.count({ where: { role, status: 'approved' } }),
      denied: await prisma.clearanceStage.count({ where: { role, status: 'denied' } }),
    })),
  )

  res.json({
    totals: {
      students: totalStudents,
      pending_accounts: pendingAccounts,
      active_requests: activeRequests,
      completed_requests: completedRequests,
      denied_requests: deniedRequests,
      pending_payments: pendingPayments,
      unpaid_fines: unpaidFines,
    },
    stages: stageBreakdown,
  })
}

// Build the report dataset honoring ?status= and ?stage= filters.
async function queryReport(query) {
  const where = {}
  if (query.status) where.status = query.status.toLowerCase()

  const requests = await prisma.clearanceRequest.findMany({
    where,
    include: { stages: true, student: true },
    orderBy: { createdAt: 'desc' },
  })

  // Stage filter is computed post-query: include only requests whose current
  // pending stage matches (or, for completed, whose last stage equals query).
  const filterStage = query.stage
  const rows = requests
    .map((r) => {
      const ordered = STAGE_ORDER.map((role) => r.stages.find((s) => s.role === role))
      const currentStage =
        ordered.find((s) => s?.status === 'pending')?.role ??
        ordered[ordered.length - 1]?.role
      return {
        id: r.id,
        reference_no: r.referenceNo,
        school_id: r.student.schoolId,
        name: `${r.student.firstName} ${r.student.lastName}`.trim(),
        course: r.student.course || '',
        status: r.status,
        current_stage: currentStage,
        current_stage_label: STAGE_LABELS[currentStage] || currentStage,
        updated_at: r.completedAt || r.createdAt,
      }
    })
    .filter((row) => !filterStage || row.current_stage === filterStage)

  return rows
}

// GET /api/admin/reports/clearance — JSON listing
export async function clearanceReport(req, res) {
  const rows = await queryReport(req.query)
  res.json({ count: rows.length, rows })
}

// GET /api/admin/reports/clearance.csv — CSV download (Excel-compatible)
export async function clearanceReportCsv(req, res) {
  const rows = await queryReport(req.query)
  const header = ['Reference No', 'School ID', 'Name', 'Course', 'Status', 'Current Stage', 'Updated']
  const lines = [header.join(',')]
  for (const r of rows) {
    lines.push(
      [
        r.reference_no,
        r.school_id,
        `"${r.name.replace(/"/g, '""')}"`,
        `"${(r.course || '').replace(/"/g, '""')}"`,
        r.status,
        r.current_stage_label,
        new Date(r.updated_at).toISOString(),
      ].join(','),
    )
  }
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', 'attachment; filename="clearance-report.csv"')
  res.send(lines.join('\n'))
}

// GET /api/admin/reports/clearance.pdf — printable PDF
export async function clearanceReportPdf(req, res) {
  const rows = await queryReport(req.query)
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'inline; filename="clearance-report.pdf"')

  const doc = new PDFDocument({ size: 'A4', margin: 40 })
  doc.pipe(res)

  doc.fontSize(18).text('CICS E-Clearance Report', { align: 'center' })
  doc.moveDown(0.5)
  doc.fontSize(10).fillColor('#666').text(
    `Generated ${new Date().toLocaleString()} · ${rows.length} record(s)`,
    { align: 'center' },
  )
  doc.moveDown()
  doc.fillColor('black')

  const cols = [
    { h: 'Ref No', w: 80 },
    { h: 'School ID', w: 70 },
    { h: 'Name', w: 130 },
    { h: 'Course', w: 70 },
    { h: 'Status', w: 60 },
    { h: 'Current Stage', w: 100 },
  ]
  let y = doc.y
  let x = 40
  doc.fontSize(10).font('Helvetica-Bold')
  cols.forEach((c) => {
    doc.text(c.h, x, y, { width: c.w })
    x += c.w
  })
  doc.moveTo(40, y + 14).lineTo(555, y + 14).stroke()
  doc.font('Helvetica')

  y += 20
  for (const r of rows) {
    if (y > 780) {
      doc.addPage()
      y = 40
    }
    x = 40
    const cells = [
      r.reference_no,
      r.school_id,
      r.name,
      r.course,
      r.status,
      r.current_stage_label,
    ]
    cells.forEach((val, i) => {
      doc.text(String(val ?? ''), x, y, { width: cols[i].w })
      x += cols[i].w
    })
    y += 18
  }

  doc.end()
}
