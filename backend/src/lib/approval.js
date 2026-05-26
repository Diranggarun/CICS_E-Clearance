import { STAGE_ORDER } from './clearance.js'

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
