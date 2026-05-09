import { Router } from 'express'
import { listPending, approveAccount, denyAccount } from '../controllers/admin.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth, requireRole('bytes_officer'))

router.get('/pending-accounts', listPending)
router.post('/pending-accounts/:id/approve', approveAccount)
router.post('/pending-accounts/:id/deny', denyAccount)

export default router
