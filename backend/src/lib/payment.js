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
