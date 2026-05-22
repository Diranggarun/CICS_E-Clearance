<<<<<<< HEAD
import prisma from '../lib/prisma.js'
import { notify } from '../notifications/notify.js'

=======
import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js'
import { notify } from '../notifications/notify.js'

const STAFF_ROLES = [
  'admin',
  'bytes_officer',
  'cursor_org',
  'department_org',
  'librarian',
  'faculty_adviser',
  'chairperson',
  'dean',
  'enrolling_faculty',
]

// POST /api/admin/users — BYTES Officer creates a staff/officer account
// directly (skips the pending-approval flow used for student self-signup).
export async function createUser(req, res) {
  const { firstName, lastName, email, role, password, schoolId } = req.body || {}

  if (!firstName || !lastName || !email || !role || !password) {
    return res.status(400).json({
      message: 'firstName, lastName, email, role, and password are required.',
    })
  }
  if (!STAFF_ROLES.includes(role)) {
    return res.status(400).json({
      message: `role must be one of: ${STAFF_ROLES.join(', ')}`,
    })
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' })
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, ...(schoolId ? [{ schoolId }] : [])] },
  })
  if (existing) {
    return res.status(409).json({
      message: existing.email === email ? 'Email already registered.' : 'School ID already in use.',
    })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      role,
      passwordHash,
      schoolId: schoolId || `STAFF-${Date.now()}`,
      status: 'approved',
      approvedById: req.user.id,
      approvedAt: new Date(),
    },
    select: {
      id: true, firstName: true, lastName: true, email: true, role: true, schoolId: true,
    },
  })

  res.status(201).json({ message: 'User created.', user })
}

// GET /api/admin/students — list of approved students for picker UIs.
export async function listStudents(_req, res) {
  const students = await prisma.user.findMany({
    where: { role: 'student', status: 'approved' },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    select: {
      id: true, schoolId: true, firstName: true, lastName: true,
      email: true, course: true,
    },
  })
  res.json({ students })
}

>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
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
  notify({
    userId: updated.id,
    userEmail: updated.email,
    type: 'account',
    title: 'Account approved',
    message: 'Your CICS E-Clearance account has been approved. You may now log in.',
    emailKey: 'accountApproval',
    emailArgs: [updated.firstName],
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
  const updated = await prisma.user.update({
    where: { id },
    data: { status: 'denied', denialReason: reason, approvedById: req.user.id, approvedAt: new Date() },
  })
  notify({
    userId: updated.id,
    userEmail: updated.email,
    type: 'account',
    title: 'Account application denied',
    message: `Your account application was denied. Reason: ${reason}`,
    emailKey: 'accountDenial',
    emailArgs: [updated.firstName, reason],
  })
  res.json({ message: 'Account denied' })
}
