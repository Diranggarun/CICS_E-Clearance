import PDFDocument from 'pdfkit'
import { STAGE_ORDER, STAGE_LABELS } from './clearance.js'

const fmtDate = (d) =>
  d ? new Date(d).toLocaleString('en-PH', { dateStyle: 'long', timeStyle: 'short' }) : '—'

const fullName = (u) =>
  [u.firstName, u.middleName, u.lastName].filter(Boolean).join(' ')

// Streams a printable clearance form to the given writable stream (res).
// Caller must have already verified every stage is approved.
export function streamClearancePdf(stream, { request, student }) {
  const doc = new PDFDocument({ size: 'A4', margin: 56 })
  doc.pipe(stream)

  doc
    .fontSize(16).font('Helvetica-Bold')
    .text('Mindanao State University — Main Campus', { align: 'center' })
    .fontSize(13)
    .text('College of Information and Computing Studies', { align: 'center' })
    .moveDown(0.3)
    .fontSize(15).text('STUDENT E-CLEARANCE FORM', { align: 'center' })
    .moveDown(0.2)
    .fontSize(10).font('Helvetica')
    .text(`Reference No: ${request.referenceNo}`, { align: 'center' })
    .text(`Academic Year: ${request.academicYear}`, { align: 'center' })
    .moveDown(1)

  doc.fontSize(11).font('Helvetica-Bold').text('Student Details').moveDown(0.3)
  doc.font('Helvetica').fontSize(10)
  const rows = [
    ['Name', fullName(student)],
    ['School ID', student.schoolId],
    ['Course', student.course || '—'],
    ['College', student.college || '—'],
    ['Department', student.department || '—'],
    ['Email', student.email],
  ]
  rows.forEach(([k, v]) => doc.text(`${k}: `, { continued: true }).font('Helvetica-Bold').text(v).font('Helvetica'))
  doc.moveDown(1)

  doc.fontSize(11).font('Helvetica-Bold').text('Approvals').moveDown(0.4)
  const byRole = new Map(request.stages.map((s) => [s.role, s]))
  STAGE_ORDER.forEach((role) => {
    const s = byRole.get(role)
    const approver = s?.approver ? fullName(s.approver) : '—'
    doc.font('Helvetica-Bold').fontSize(10).text(STAGE_LABELS[role])
    doc.font('Helvetica').fontSize(9)
      .text(`   Status: ${s?.status ?? 'pending'}`)
      .text(`   Approved by: ${approver}`)
      .text(`   Date: ${fmtDate(s?.decidedAt)}`)
      .moveDown(0.4)
  })

  doc.moveDown(1).fontSize(8).fillColor('#666')
    .text(`Generated on ${fmtDate(new Date())}. This document is system-generated; verify via reference number ${request.referenceNo}.`, { align: 'center' })

  doc.end()
}
