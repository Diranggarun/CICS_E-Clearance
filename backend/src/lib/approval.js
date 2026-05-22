import { STAGE_ORDER } from './clearance.js'

<<<<<<< HEAD
// Maps a user role to the StageRole it can decide on.
export const ROLE_TO_STAGE = {
  bytes_officer: 'bytes_officer',
  librarian: 'librarian',
  faculty_adviser: 'faculty_adviser',
  chairperson: 'chairperson',
  dean: 'dean',
}

// Prerequisites for each stage. A stage can only be decided once all of its
// prerequisites are 'approved'. Librarian can run anytime after submission.
export const STAGE_PREREQUISITES = {
  bytes_officer: [],
  librarian: [],
  faculty_adviser: ['bytes_officer'],
  chairperson: ['bytes_officer', 'librarian', 'faculty_adviser'],
  dean: ['bytes_officer', 'librarian', 'faculty_adviser', 'chairperson'],
}
=======
// Maps a user role to the StageRole it can decide on. Every approver role
// owns exactly one stage of the same name.
export const ROLE_TO_STAGE = Object.fromEntries(
  STAGE_ORDER.map((role) => [role, role]),
)

// Org-fee stages: their officer can only approve once the student has settled
// that organization's fee (Cursor / Department / BYTES). The BYTES stage also
// keeps the legacy unpaid-fines check. See controllers/approval.controller.js.
export const ORG_FEE_STAGES = ['cursor_org', 'department_org', 'bytes_officer']

// Strictly-sequential gating: a stage can only be decided once EVERY stage
// before it in STAGE_ORDER is 'approved'. Derived so the pipeline order is
// defined in exactly one place (lib/clearance.js).
export const STAGE_PREREQUISITES = Object.fromEntries(
  STAGE_ORDER.map((role, i) => [role, STAGE_ORDER.slice(0, i)]),
)
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e

// Returns null if prerequisites are met; otherwise an array of pending prereq roles.
export function checkPrerequisites(stages, targetRole) {
  const prereqs = STAGE_PREREQUISITES[targetRole] || []
  const byRole = new Map(stages.map((s) => [s.role, s]))
  const unmet = prereqs.filter((r) => byRole.get(r)?.status !== 'approved')
  return unmet.length ? unmet : null
}

// Returns true iff every stage in STAGE_ORDER is approved.
export function isFullyApproved(stages) {
  if (stages.length !== STAGE_ORDER.length) return false
  return stages.every((s) => s.status === 'approved')
}

// Returns true iff any stage is denied.
export function hasDenial(stages) {
  return stages.some((s) => s.status === 'denied')
}
