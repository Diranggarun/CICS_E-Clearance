import express from 'express'
import prisma from '../lib/prisma.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

const router = express.Router()

router.use(requireAuth)

<<<<<<< HEAD
// BYTES Officer issues a fine to a student.
router.post(
  '/',
  requireRole('bytes_officer'),
=======
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
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
  asyncHandler(async (req, res) => {
    const { studentId, amount, reason } = req.body
    if (!studentId || !amount || !reason) {
      return res.status(400).json({ message: 'studentId, amount, and reason are required.' })
    }
<<<<<<< HEAD
    const fine = await prisma.fine.create({
      data: { studentId, amount: Number(amount), reason, status: 'unpaid' },
=======
    const target = await resolveStudentId(studentId)
    if (!target) {
      return res.status(404).json({ message: `No user found for "${studentId}".` })
    }
    if (target.role !== 'student') {
      return res.status(400).json({ message: 'Fines can only be issued to students.' })
    }
    const fine = await prisma.fine.create({
      data: { studentId: target.id, amount: Number(amount), reason, status: 'unpaid' },
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
    })
    res.status(201).json(fine)
  }),
)

<<<<<<< HEAD
// A student may read only their own fines. BYTES Officer may read anyone's.
=======
// A student may read only their own fines. Admin may read anyone's
// (and may pass either a UUID or a school ID).
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
router.get(
  '/:studentId',
  asyncHandler(async (req, res) => {
    const { studentId } = req.params
<<<<<<< HEAD
    if (req.user.role !== 'bytes_officer' && req.user.id !== studentId) {
      return res.status(403).json({ message: 'You can only view your own fines.' })
    }
    const fines = await prisma.fine.findMany({
      where: { studentId },
=======
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
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
      orderBy: { createdAt: 'desc' },
    })
    res.json(fines)
  }),
)

<<<<<<< HEAD
// BYTES Officer updates a fine (e.g. mark paid, edit amount).
router.put(
  '/:id',
  requireRole('bytes_officer'),
=======
// Admin updates a fine (e.g. mark paid, edit amount).
router.put(
  '/:id',
  requireRole('admin'),
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
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
<<<<<<< HEAD
  requireRole('bytes_officer'),
=======
  requireRole('admin'),
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
  asyncHandler(async (req, res) => {
    await prisma.fine.delete({ where: { id: req.params.id } })
    res.json({ message: 'Fine removed.' })
  }),
)

export default router
