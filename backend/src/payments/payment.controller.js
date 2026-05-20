import prisma from '../lib/prisma.js'
import { notify } from '../notifications/notify.js'
import { ORG_FEE_STAGES } from '../lib/approval.js'

const ALLOWED_TYPES = ['fine', 'fee']
const ALLOWED_METHODS = ['gcash', 'onsite']

const STAFF_VIEWER = (role) => role === 'admin' || ORG_FEE_STAGES.includes(role)

// Who may decide (approve/deny) a given payment:
//   - Admin may decide any payment, and is the only role that settles fines.
//   - An org officer (cursor_org / department_org / bytes_officer) may decide
//     only fee payments tagged to their own organization.
function canDecidePayment(user, payment) {
  if (user.role === 'admin') return true
  if (payment.type === 'fee') return user.role === payment.orgRole
  return false
}

// POST /api/payments — student submits a payment.
export async function createPayment(req, res) {
  const { type, amount, method, receipt, fineId, orgRole } = req.body || {}

  if (!ALLOWED_TYPES.includes(type)) {
    return res.status(400).json({ message: 'type must be "fine" or "fee".' })
  }
  if (!ALLOWED_METHODS.includes(method)) {
    return res.status(400).json({ message: 'method must be "gcash" or "onsite".' })
  }
  if (method === 'gcash' && !receipt) {
    return res.status(400).json({ message: 'GCash payments require a receipt upload.' })
  }
  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ message: 'amount must be positive.' })
  }

  // If paying a fine, verify it exists and belongs to this student.
  if (type === 'fine' && fineId) {
    const fine = await prisma.fine.findUnique({ where: { id: fineId } })
    if (!fine || fine.studentId !== req.user.id) {
      return res.status(404).json({ message: 'Fine not found.' })
    }
  }

  // Fee payments must name the org-fee stage they settle so the right office
  // verifies them and the approval engine can gate that stage.
  let resolvedOrgRole = null
  if (type === 'fee') {
    if (!orgRole || !ORG_FEE_STAGES.includes(orgRole)) {
      return res.status(400).json({
        message: `Fee payments require orgRole to be one of: ${ORG_FEE_STAGES.join(', ')}`,
      })
    }
    resolvedOrgRole = orgRole
  }

  const payment = await prisma.payment.create({
    data: {
      userId: req.user.id,
      type,
      amount: Number(amount),
      method,
      receipt: receipt || null,
      orgRole: resolvedOrgRole,
      status: 'pending',
    },
  })
  res.status(201).json(payment)
}

// GET /api/payments — Admin sees all; an org officer sees their own org's fee
// payments; students see only their own.
export async function listPayments(req, res) {
  let where
  if (req.user.role === 'admin') {
    where = {}
  } else if (ORG_FEE_STAGES.includes(req.user.role)) {
    where = { type: 'fee', orgRole: req.user.role }
  } else {
    where = { userId: req.user.id }
  }
  if (req.query.status) where.status = req.query.status

  const payments = await prisma.payment.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: STAFF_VIEWER(req.user.role)
      ? { user: { select: { firstName: true, lastName: true, schoolId: true } } }
      : undefined,
  })
  res.json(payments)
}

// PUT /api/payments/:id/approve — Admin (any) or the owning org officer (fees).
export async function approvePayment(req, res) {
  const payment = await prisma.payment.findUnique({ where: { id: req.params.id } })
  if (!payment) return res.status(404).json({ message: 'Payment not found.' })
  if (!canDecidePayment(req.user, payment)) {
    return res.status(403).json({ message: 'You cannot verify this payment.' })
  }
  if (payment.status !== 'pending') {
    return res.status(409).json({ message: `Payment already ${payment.status}.` })
  }

  // Use a transaction so the linked fine flips with the payment.
  const [updated] = await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'approved' },
    }),
    ...(payment.type === 'fine'
      ? [
          prisma.fine.updateMany({
            where: { studentId: payment.userId, status: 'unpaid' },
            data: { status: 'paid' },
          }),
        ]
      : []),
  ])

  const user = await prisma.user.findUnique({ where: { id: payment.userId } })
  if (user) {
    notify({
      userId: user.id,
      userEmail: user.email,
      type: 'payment',
      title: 'Payment confirmed',
      message: `Your payment of ₱${payment.amount} has been approved.`,
      emailKey: 'paymentConfirmation',
      emailArgs: [user.firstName, payment.id.slice(0, 8).toUpperCase(), payment.amount],
    })
  }

  res.json(updated)
}

// PUT /api/payments/:id/deny — Admin (any) or the owning org officer (fees).
export async function denyPayment(req, res) {
  const reason = (req.body?.reason || '').trim()
  if (!reason) return res.status(400).json({ message: 'Denial reason required.' })

  const payment = await prisma.payment.findUnique({ where: { id: req.params.id } })
  if (!payment) return res.status(404).json({ message: 'Payment not found.' })
  if (!canDecidePayment(req.user, payment)) {
    return res.status(403).json({ message: 'You cannot verify this payment.' })
  }
  if (payment.status !== 'pending') {
    return res.status(409).json({ message: `Payment already ${payment.status}.` })
  }

  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: { status: 'rejected' },
  })

  const user = await prisma.user.findUnique({ where: { id: payment.userId } })
  if (user) {
    notify({
      userId: user.id,
      userEmail: user.email,
      type: 'payment',
      title: 'Payment denied',
      message: `Your payment of ₱${payment.amount} was denied. Reason: ${reason}`,
    })
  }

  res.json(updated)
}

// POST /api/payments/upload — returns the stored filename for use in createPayment.
export async function uploadReceipt(req, res) {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' })
  res.json({ file: req.file.filename, size: req.file.size })
}
