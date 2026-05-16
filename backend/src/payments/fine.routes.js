import express from 'express'
import prisma from '../lib/prisma.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

const router = express.Router()

router.use(requireAuth)

// BYTES Officer issues a fine to a student.
router.post(
  '/',
  requireRole('bytes_officer'),
  asyncHandler(async (req, res) => {
    const { studentId, amount, reason } = req.body
    if (!studentId || !amount || !reason) {
      return res.status(400).json({ message: 'studentId, amount, and reason are required.' })
    }
    const fine = await prisma.fine.create({
      data: { studentId, amount: Number(amount), reason, status: 'unpaid' },
    })
    res.status(201).json(fine)
  }),
)

// A student may read only their own fines. BYTES Officer may read anyone's.
router.get(
  '/:studentId',
  asyncHandler(async (req, res) => {
    const { studentId } = req.params
    if (req.user.role !== 'bytes_officer' && req.user.id !== studentId) {
      return res.status(403).json({ message: 'You can only view your own fines.' })
    }
    const fines = await prisma.fine.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    })
    res.json(fines)
  }),
)

// BYTES Officer updates a fine (e.g. mark paid, edit amount).
router.put(
  '/:id',
  requireRole('bytes_officer'),
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
  requireRole('bytes_officer'),
  asyncHandler(async (req, res) => {
    await prisma.fine.delete({ where: { id: req.params.id } })
    res.json({ message: 'Fine removed.' })
  }),
)

export default router
