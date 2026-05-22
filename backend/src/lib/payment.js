import prisma from './prisma.js'

// Gating helpers used by the clearance/approval flow.
//
// BYTES Officer should not be able to approve a student's clearance while the
// student still has unpaid fines or unpaid fee obligations. Approval module
// calls these before allowing a 'bytes_officer' stage decision to succeed.

export async function hasUnpaidFines(studentId) {
  const count = await prisma.fine.count({
    where: { studentId, status: 'unpaid' },
  })
  return count > 0
}

// Fees are college-wide line items; "unpaid" means the student has no
// approved payment of type 'fee' covering at least the fee amount. The
// minimum-viable check: any approved fee payment exists for this user.
export async function hasUnpaidFees(studentId) {
  const fees = await prisma.fee.findMany()
  if (fees.length === 0) return false
  const approved = await prisma.payment.count({
    where: { userId: studentId, type: 'fee', status: 'approved' },
  })
  return approved === 0
}

export async function listFinancialBlockers(studentId) {
  const [fines, feesUnpaid] = await Promise.all([
    prisma.fine.findMany({ where: { studentId, status: 'unpaid' } }),
    hasUnpaidFees(studentId),
  ])
  return {
    unpaid_fines: fines,
    has_unpaid_fees: feesUnpaid,
  }
}
<<<<<<< HEAD
=======

// --- Per-org fee gating (9-stage workflow) ---
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
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
