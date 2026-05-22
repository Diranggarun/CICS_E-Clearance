import { describe, it, expect } from 'vitest'
import {
  STAGE_ORDER,
  STAGE_LABELS,
  currentAcademicYear,
  generateReferenceNo,
  buildProgress,
  ACTIVE_STATUSES,
} from '../src/lib/clearance.js'

describe('STAGE_ORDER', () => {
  it('matches the documented 9-stage pipeline in order', () => {
    expect(STAGE_ORDER).toEqual([
      'admin',
      'cursor_org',
      'department_org',
      'bytes_officer',
      'librarian',
      'faculty_adviser',
      'chairperson',
      'dean',
      'enrolling_faculty',
    ])
  })

  it('every stage has a human label', () => {
    for (const role of STAGE_ORDER) {
      expect(STAGE_LABELS[role]).toBeTruthy()
    }
  })
})

describe('currentAcademicYear', () => {
  it('returns 2025-2026 for January 2026 (still last AY)', () => {
    expect(currentAcademicYear(new Date('2026-01-15'))).toBe('2025-2026')
  })

  it('returns 2026-2027 for June 2026 (rollover month)', () => {
    expect(currentAcademicYear(new Date('2026-06-01'))).toBe('2026-2027')
  })

  it('returns 2026-2027 for December 2026', () => {
    expect(currentAcademicYear(new Date('2026-12-31'))).toBe('2026-2027')
  })

  it('returns 2024-2025 for May 2025 (just before rollover)', () => {
    expect(currentAcademicYear(new Date('2025-05-31'))).toBe('2024-2025')
  })
})

describe('generateReferenceNo', () => {
  it('matches the EC-YYYY-XXXXXX format', () => {
    const ref = generateReferenceNo(new Date('2026-05-19'))
    expect(ref).toMatch(/^EC-2026-[A-Z0-9]{6}$/)
  })

  it('produces distinct refs across calls', () => {
    const a = generateReferenceNo()
    const b = generateReferenceNo()
    expect(a).not.toBe(b)
  })
})

describe('buildProgress', () => {
  const baseRequest = {
    id: 'req-1',
    referenceNo: 'EC-2026-ABC123',
    academicYear: '2025-2026',
    status: 'pending',
    createdAt: '2026-05-01T00:00:00Z',
    completedAt: null,
    stages: STAGE_ORDER.map((role) => ({
      role,
      status: 'pending',
      reason: null,
      approver: null,
      decidedAt: null,
    })),
  }

  it('returns all stages in canonical order', () => {
    const p = buildProgress(baseRequest)
    expect(p.stages.map((s) => s.role)).toEqual(STAGE_ORDER)
  })

  it('reports 0 approved when all pending', () => {
    expect(buildProgress(baseRequest).approved_count).toBe(0)
  })

  it('reports approved_count correctly after partial approval', () => {
    const req = {
      ...baseRequest,
      stages: STAGE_ORDER.map((role, i) => ({
        role,
        status: i < 2 ? 'approved' : 'pending',
        reason: null,
        approver: null,
        decidedAt: null,
      })),
    }
    expect(buildProgress(req).approved_count).toBe(2)
  })

  it('formats approver name when present', () => {
    const req = {
      ...baseRequest,
      stages: [
        {
          role: STAGE_ORDER[0],
          status: 'approved',
          reason: null,
          approver: { firstName: 'Jane', lastName: 'Doe' },
          decidedAt: '2026-05-02T00:00:00Z',
        },
        ...STAGE_ORDER.slice(1).map((role) => ({
          role,
          status: 'pending',
          reason: null,
          approver: null,
          decidedAt: null,
        })),
      ],
    }
    expect(buildProgress(req).stages[0].approver).toBe('Jane Doe')
  })
})

describe('ACTIVE_STATUSES', () => {
  it('includes pending and approved', () => {
    expect(ACTIVE_STATUSES).toContain('pending')
    expect(ACTIVE_STATUSES).toContain('approved')
  })

  it('does not include denied or failed', () => {
    expect(ACTIVE_STATUSES).not.toContain('denied')
    expect(ACTIVE_STATUSES).not.toContain('failed')
  })
})
