import express from 'express'
import prisma from '../lib/prisma.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../lib/asyncHandler.js'
import { ORG_FEE_STAGES } from '../lib/approval.js'

const router = express.Router()

router.use(requireAuth)

// Admin manages the whole fee catalogue; each org officer manages their own
// organization's fees.
const FEE_MANAGER_ROLES = ['admin', ...ORG_FEE_STAGES]

// Anyone authenticated may list fees (read-only catalogue).
// Optional ?orgRole= filter so the student payment page can group by org.
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const where = {}
    if (req.query.orgRole) where.orgRole = req.query.orgRole
    const fees = await prisma.fee.findMany({ where, orderBy: { name: 'asc' } })
    res.json(fees)
  }),
)

// Create a fee. An org officer may only create fees for their own org; Admin
// may create a fee for any org-fee stage.
router.post(
  '/',
  requireRole(...FEE_MANAGER_ROLES),
  asyncHandler(async (req, res) => {
    const { name, amount } = req.body
    if (!name || amount == null) {
      return res.status(400).json({ message: 'name and amount are required.' })
    }

    let orgRole = req.user.role
    if (req.user.role === 'admin') {
      orgRole = req.body.orgRole || null
      if (orgRole && !ORG_FEE_STAGES.includes(orgRole)) {
        return res.status(400).json({ message: 'orgRole must be a valid org-fee stage.' })
      }
    }

    const fee = await prisma.fee.create({
      data: { name, amount: Number(amount), orgRole },
    })
    res.status(201).json(fee)
  }),
)

router.delete(
  '/:id',
  requireRole(...FEE_MANAGER_ROLES),
  asyncHandler(async (req, res) => {
    const fee = await prisma.fee.findUnique({ where: { id: req.params.id } })
    if (!fee) return res.status(404).json({ message: 'Fee not found.' })
    if (req.user.role !== 'admin' && fee.orgRole !== req.user.role) {
      return res.status(403).json({ message: "You can only remove your organization's fees." })
    }
    await prisma.fee.delete({ where: { id: req.params.id } })
    res.json({ message: 'Fee removed.' })
  }),
)

export default router
