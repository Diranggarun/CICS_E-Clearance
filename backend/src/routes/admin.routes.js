import { Router } from 'express'
import { listPending, approveAccount, denyAccount } from '../controllers/admin.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

const router = Router()

router.use(requireAuth, requireRole('bytes_officer'))

router.get('/pending-accounts', asyncHandler(listPending))
router.post('/pending-accounts/:id/approve', asyncHandler(approveAccount))
router.post('/pending-accounts/:id/deny', asyncHandler(denyAccount))

export default router
