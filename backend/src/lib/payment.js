import prisma from './prisma.js'

// Gating helpers used by the clearance/approval flow.
//
// Per-org fee gating (9-stage workflow): each org-fee stage (cursor_org /
// department_org / bytes_officer) is gated on the student having settled
// that organization's fee. The BYTES stage additionally checks unpaid fines.

export async function hasUnpaidFines(studentId) {
  const count = await prisma.fine.count({
    where: { studentId, status: 'unpaid' },
  })
  return count > 0
}

// --- Per-org fee gating ---
//
// Each org-fee stage (cursor_org / department_org / bytes_officer) owns a set
// of Fee rows tagged with its orgRole. A student has "settled" that org when
// every one of the org's fees is covered by an approved fee payment tagged to
// the same org. An org with no configured fees has nothing to settle.

export async function hasUnpaidOrgFee(studentId, orgRole) {
  const fees = await prisma.fee.findMany({ where: { orgRole } })
  if (fees.length === 0) return false

  const approvedCount = await prisma.payment.count({
    where: { userId: studentId, type: 'fee', orgRole, status: 'approved' },
  })
  // One approved payment per configured fee is required.
  return approvedCount < fees.length
}

// Financial blockers for a single org-fee stage. The BYTES stage additionally
// reports unpaid fines (fines are settled at the BYTES org window).
export async function listOrgFinancialBlockers(studentId, orgRole) {
  const orgFeeUnpaid = await hasUnpaidOrgFee(studentId, orgRole)
  const fines =
    orgRole === 'bytes_officer'
      ? await prisma.fine.findMany({ where: { studentId, status: 'unpaid' } })
      : []
  return {
    org_role: orgRole,
    org_fee_unpaid: orgFeeUnpaid,
    unpaid_fines: fines,
  }
}
