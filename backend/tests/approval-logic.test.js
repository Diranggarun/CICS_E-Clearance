import { describe, it, expect } from 'vitest'
import {
  STAGE_PREREQUISITES,
  ROLE_TO_STAGE,
  ORG_FEE_STAGES,
  checkPrerequisites,
  isFullyApproved,
  hasDenial,
} from '../src/lib/approval.js'
import { STAGE_ORDER } from '../src/lib/clearance.js'

const stagesFor = (overrides = {}) =>
  STAGE_ORDER.map((role) => ({
    role,
    status: overrides[role] ?? 'pending',
  }))

// Builds an overrides object approving every stage strictly before `role`.
const approveBefore = (role) =>
  Object.fromEntries(
    STAGE_ORDER.slice(0, STAGE_ORDER.indexOf(role)).map((r) => [r, 'approved']),
  )

describe('STAGE_PREREQUISITES (strict sequential)', () => {
  it('the first stage has no prerequisites', () => {
    expect(STAGE_PREREQUISITES[STAGE_ORDER[0]]).toEqual([])
  })

  it('every stage requires exactly all stages before it in STAGE_ORDER', () => {
    STAGE_ORDER.forEach((role, i) => {
      expect(STAGE_PREREQUISITES[role]).toEqual(STAGE_ORDER.slice(0, i))
    })
  })

  it('the final stage requires all eight prior stages', () => {
    const last = STAGE_ORDER[STAGE_ORDER.length - 1]
    expect(STAGE_PREREQUISITES[last]).toEqual(STAGE_ORDER.slice(0, -1))
  })
})

describe('checkPrerequisites', () => {
  it('returns null for the first stage (always allowed)', () => {
    expect(checkPrerequisites(stagesFor(), STAGE_ORDER[0])).toBeNull()
  })

  it('blocks a stage while any prior stage is pending', () => {
    const unmet = checkPrerequisites(stagesFor(), 'librarian')
    expect(unmet).toEqual(STAGE_PREREQUISITES.librarian)
  })

  it('allows a stage once every prior stage is approved', () => {
    const stages = stagesFor(approveBefore('dean'))
    expect(checkPrerequisites(stages, 'dean')).toBeNull()
  })

  it('blocks the final stage if any prior stage is pending', () => {
    const last = STAGE_ORDER[STAGE_ORDER.length - 1]
    const partial = approveBefore(last)
    delete partial.dean // leave Dean pending
    const unmet = checkPrerequisites(stagesFor(partial), last)
    expect(unmet).toContain('dean')
  })

  it('treats denied as not approved (does not satisfy prereq)', () => {
    const stages = stagesFor({ admin: 'denied' })
    expect(checkPrerequisites(stages, 'cursor_org')).toEqual(['admin'])
  })
})

describe('isFullyApproved', () => {
  it('false when any stage is pending', () => {
    const partial = approveBefore(STAGE_ORDER[STAGE_ORDER.length - 1])
    expect(isFullyApproved(stagesFor(partial))).toBe(false)
  })

  it('true when all stages are approved', () => {
    const all = Object.fromEntries(STAGE_ORDER.map((r) => [r, 'approved']))
    expect(isFullyApproved(stagesFor(all))).toBe(true)
  })

  it('false when the stage count is malformed', () => {
    expect(isFullyApproved([])).toBe(false)
  })
})

describe('hasDenial', () => {
  it('false when no stage is denied', () => {
    expect(hasDenial(stagesFor({ admin: 'approved' }))).toBe(false)
  })

  it('true when at least one stage is denied', () => {
    expect(hasDenial(stagesFor({ librarian: 'denied' }))).toBe(true)
  })
})

describe('ROLE_TO_STAGE', () => {
  it('maps every approver role in STAGE_ORDER to its own stage', () => {
    STAGE_ORDER.forEach((role) => {
      expect(ROLE_TO_STAGE[role]).toBe(role)
    })
  })

  it('does not map student or unknown roles', () => {
    expect(ROLE_TO_STAGE.student).toBeUndefined()
    expect(ROLE_TO_STAGE.unknown).toBeUndefined()
  })
})

describe('ORG_FEE_STAGES', () => {
  it('contains the three organization fee stages', () => {
    expect(ORG_FEE_STAGES).toEqual(['cursor_org', 'department_org', 'bytes_officer'])
  })
})
