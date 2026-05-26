import express from 'express'
import prisma from '../lib/prisma.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

const router = express.Router()

router.use(requireAuth)

// Resolve either a UUID or a school ID to the canonical user.id. Helps the Admin
// paste either format in the dashboard without needing to look up UUIDs.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
async function resolveStudentId(idOrSchoolId) {
  if (!idOrSchoolId) return null
  const where = UUID_RE.test(idOrSchoolId)
    ? { id: idOrSchoolId }
    : { schoolId: idOrSchoolId }
  const user = await prisma.user.findFirst({ where, select: { id: true, role: true } })
  return user
}

// Admin issues a fine to a student.
router.post(
  '/',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const { studentId, amount, reason } = req.body
    if (!studentId || !amount || !reason) {
      return res.status(400).json({ message: 'studentId, amount, and reason are required.' })
    }
    const target = await resolveStudentId(studentId)
    if (!target) {
      return res.status(404).json({ message: `No user found for "${studentId}".` })
    }
    if (target.role !== 'student') {
      return res.status(400).json({ message: 'Fines can only be issued to students.' })
    }
    const fine = await prisma.fine.create({
      data: { studentId: target.id, amount: Number(amount), reason, status: 'unpaid' },
    })
    res.status(201).json(fine)
  }),
)

// A student may read only their own fines. Admin may read anyone's
// (and may pass either a UUID or a school ID).
router.get(
  '/:studentId',
  asyncHandler(async (req, res) => {
    const { studentId } = req.params
    let resolvedId = studentId
    if (req.user.role === 'admin' && !UUID_RE.test(studentId)) {
      const target = await resolveStudentId(studentId)
      if (!target) return res.status(404).json({ message: `No user found for "${studentId}".` })
      resolvedId = target.id
    }
    if (req.user.role !== 'admin' && req.user.id !== resolvedId) {
      return res.status(403).json({ message: 'You can only view your own fines.' })
    }
    const fines = await prisma.fine.findMany({
      where: { studentId: resolvedId },
      orderBy: { createdAt: 'desc' },
    })
    res.json(fines)
  }),
)

// Admin updates a fine (e.g. mark paid, edit amount).
router.put(
  '/:id',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const fine = await prisma.fine.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(fine)
  }),
)

router.delete(
  '/:id',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    await prisma.fine.delete({ where: { id: req.params.id } })
    res.json({ message: 'Fine removed.' })
  }),
)

export default router
