import { describe, it, expect } from 'vitest'
import {
  STAGE_PREREQUISITES,
  ROLE_TO_STAGE,
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

describe('STAGE_PREREQUISITES', () => {
  it('bytes and librarian have no prerequisites', () => {
    expect(STAGE_PREREQUISITES.bytes_officer).toEqual([])
    expect(STAGE_PREREQUISITES.librarian).toEqual([])
  })

  it('adviser requires bytes', () => {
    expect(STAGE_PREREQUISITES.faculty_adviser).toEqual(['bytes_officer'])
  })

  it('chairperson requires bytes + librarian + adviser', () => {
    expect(STAGE_PREREQUISITES.chairperson).toEqual([
      'bytes_officer',
      'librarian',
      'faculty_adviser',
    ])
  })

  it('dean requires all four prior stages', () => {
    expect(STAGE_PREREQUISITES.dean).toEqual([
      'bytes_officer',
      'librarian',
      'faculty_adviser',
      'chairperson',
    ])
  })
})

describe('checkPrerequisites', () => {
  it('returns null when bytes has no prereqs (always allowed)', () => {
    expect(checkPrerequisites(stagesFor(), 'bytes_officer')).toBeNull()
  })

  it('returns null when librarian has no prereqs (anytime after submission)', () => {
    expect(checkPrerequisites(stagesFor(), 'librarian')).toBeNull()
  })

  it('blocks adviser if bytes not approved', () => {
    const unmet = checkPrerequisites(stagesFor(), 'faculty_adviser')
    expect(unmet).toEqual(['bytes_officer'])
  })

  it('allows adviser once bytes is approved', () => {
    const stages = stagesFor({ bytes_officer: 'approved' })
    expect(checkPrerequisites(stages, 'faculty_adviser')).toBeNull()
  })

  it('blocks chairperson if any of bytes/librarian/adviser is pending', () => {
    const stages = stagesFor({
      bytes_officer: 'approved',
      librarian: 'approved',
    })
    const unmet = checkPrerequisites(stages, 'chairperson')
    expect(unmet).toEqual(['faculty_adviser'])
  })

  it('blocks dean if any prior stage is pending', () => {
    const stages = stagesFor({
      bytes_officer: 'approved',
      librarian: 'approved',
      faculty_adviser: 'approved',
    })
    const unmet = checkPrerequisites(stages, 'dean')
    expect(unmet).toEqual(['chairperson'])
  })

  it('allows dean once all four prior stages are approved', () => {
    const stages = stagesFor({
      bytes_officer: 'approved',
      librarian: 'approved',
      faculty_adviser: 'approved',
      chairperson: 'approved',
    })
    expect(checkPrerequisites(stages, 'dean')).toBeNull()
  })

  it('treats denied as not approved (does not satisfy prereq)', () => {
    const stages = stagesFor({ bytes_officer: 'denied' })
    expect(checkPrerequisites(stages, 'faculty_adviser')).toEqual([
      'bytes_officer',
    ])
  })
})

describe('isFullyApproved', () => {
  it('false when any stage is pending', () => {
    const stages = stagesFor({
      bytes_officer: 'approved',
      librarian: 'approved',
      faculty_adviser: 'approved',
      chairperson: 'approved',
    })
    expect(isFullyApproved(stages)).toBe(false)
  })

  it('true when all five stages are approved', () => {
    const stages = stagesFor({
      bytes_officer: 'approved',
      librarian: 'approved',
      faculty_adviser: 'approved',
      chairperson: 'approved',
      dean: 'approved',
    })
    expect(isFullyApproved(stages)).toBe(true)
  })

  it('false when fewer than 5 stages exist (malformed)', () => {
    expect(isFullyApproved([])).toBe(false)
  })
})

describe('hasDenial', () => {
  it('false when no stage is denied', () => {
    expect(hasDenial(stagesFor({ bytes_officer: 'approved' }))).toBe(false)
  })

  it('true when at least one stage is denied', () => {
    expect(hasDenial(stagesFor({ librarian: 'denied' }))).toBe(true)
  })
})

describe('ROLE_TO_STAGE', () => {
  it('maps all 5 approver roles to their stage', () => {
    expect(ROLE_TO_STAGE.bytes_officer).toBe('bytes_officer')
    expect(ROLE_TO_STAGE.librarian).toBe('librarian')
    expect(ROLE_TO_STAGE.faculty_adviser).toBe('faculty_adviser')
    expect(ROLE_TO_STAGE.chairperson).toBe('chairperson')
    expect(ROLE_TO_STAGE.dean).toBe('dean')
  })

  it('does not map student or unknown roles', () => {
    expect(ROLE_TO_STAGE.student).toBeUndefined()
    expect(ROLE_TO_STAGE.unknown).toBeUndefined()
  })
})
