import prisma from '../lib/prisma.js'

export async function listPending(_req, res) {
  const users = await prisma.user.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true, schoolId: true, role: true, firstName: true, lastName: true,
      email: true, course: true, createdAt: true,
    },
  })
  res.json({ users })
}

export async function approveAccount(req, res) {
  const { id } = req.params
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return res.status(404).json({ message: 'User not found' })
  if (user.status !== 'pending') {
    return res.status(409).json({ message: `Account already ${user.status}` })
  }
  const updated = await prisma.user.update({
    where: { id },
    data: { status: 'approved', approvedById: req.user.id, approvedAt: new Date() },
  })
  res.json({ message: 'Account approved', id: updated.id })
}

export async function denyAccount(req, res) {
  const { id } = req.params
  const reason = (req.body?.reason || '').trim()
  if (!reason) return res.status(400).json({ message: 'Denial reason required' })

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return res.status(404).json({ message: 'User not found' })
  if (user.status !== 'pending') {
    return res.status(409).json({ message: `Account already ${user.status}` })
  }
  await prisma.user.update({
    where: { id },
    data: { status: 'denied', denialReason: reason, approvedById: req.user.id, approvedAt: new Date() },
  })
  res.json({ message: 'Account denied' })
}
