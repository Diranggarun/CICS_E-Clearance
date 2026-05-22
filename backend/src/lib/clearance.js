// Shared helpers for the clearance module.

<<<<<<< HEAD
// The ordered approval pipeline. Task 4 (Approval Workflow Engine) enforces the
// prerequisite gating between these; Task 2 only creates and reads them.
export const STAGE_ORDER = [
=======
// The ordered 9-stage approval pipeline. The Approval Workflow Engine enforces
// strictly-sequential prerequisite gating between these (see lib/approval.js).
// Stages 2-4 (Cursor/Department/BYTES) are org-fee stages: their officer can
// only approve once the student has settled that organization's fee.
export const STAGE_ORDER = [
  'admin',
  'cursor_org',
  'department_org',
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
  'bytes_officer',
  'librarian',
  'faculty_adviser',
  'chairperson',
  'dean',
<<<<<<< HEAD
]

export const STAGE_LABELS = {
  bytes_officer: 'BYTES Officer',
  librarian: 'Librarian',
  faculty_adviser: 'Faculty Adviser',
  chairperson: 'Chairperson',
  dean: 'Dean',
=======
  'enrolling_faculty',
]

export const STAGE_LABELS = {
  admin: 'Admin',
  cursor_org: 'Cursor (Org Fee)',
  department_org: 'Department (Org Fee)',
  bytes_officer: 'BYTES (Org Fee)',
  librarian: 'Library',
  faculty_adviser: 'Faculty Adviser',
  chairperson: 'Chairperson',
  dean: 'Dean',
  enrolling_faculty: 'Enrolling Faculty',
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
}

// Current Philippine academic year, e.g. "2025-2026" (rolls over in June).
export function currentAcademicYear(now = new Date()) {
  const y = now.getFullYear()
  const start = now.getMonth() >= 5 ? y : y - 1
  return `${start}-${start + 1}`
}

// Human-friendly unique reference: EC-2026-AB12CD
export function generateReferenceNo(now = new Date()) {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `EC-${now.getFullYear()}-${rand}`
}

// Build the structured progress object the frontend stepper consumes.
export function buildProgress(request) {
  const byRole = new Map(request.stages.map((s) => [s.role, s]))
  const stages = STAGE_ORDER.map((role) => {
    const s = byRole.get(role)
    return {
      role,
      label: STAGE_LABELS[role],
      status: s?.status ?? 'pending',
      reason: s?.reason ?? null,
      approver: s?.approver
        ? `${s.approver.firstName} ${s.approver.lastName}`.trim()
        : null,
      decided_at: s?.decidedAt ?? null,
    }
  })
  const approvedCount = stages.filter((s) => s.status === 'approved').length
  return {
    request_id: request.id,
    reference_no: request.referenceNo,
    academic_year: request.academicYear,
    status: request.status,
    created_at: request.createdAt,
    completed_at: request.completedAt,
    approved_count: approvedCount,
    total_stages: stages.length,
    stages,
  }
}

// A request is "active" while it can still progress.
export const ACTIVE_STATUSES = ['pending', 'approved']
