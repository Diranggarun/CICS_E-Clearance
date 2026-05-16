import { STAGE_ORDER } from './clearance.js'

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
