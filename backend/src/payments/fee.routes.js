import express from 'express'
import prisma from '../lib/prisma.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

const router = express.Router()

router.use(requireAuth)

// Anyone authenticated may list fees (read-only catalogue).
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const fees = await prisma.fee.findMany({ orderBy: { name: 'asc' } })
    res.json(fees)
  }),
)

// Only BYTES Officer can manage the fee catalogue.
router.post(
  '/',
  requireRole('bytes_officer'),
  asyncHandler(async (req, res) => {
    const { name, amount } = req.body
    if (!name || amount == null) {
      return res.status(400).json({ message: 'name and amount are required.' })
    }
    const fee = await prisma.fee.create({ data: { name, amount: Number(amount) } })
    res.status(201).json(fee)
  }),
)

router.delete(
  '/:id',
  requireRole('bytes_officer'),
  asyncHandler(async (req, res) => {
    await prisma.fee.delete({ where: { id: req.params.id } })
    res.json({ message: 'Fee removed.' })
  }),
)

export default router
