import { Router } from 'express'
import {
  createRequest,
  getMine,
  getMyProgress,
  getPdf,
} from '../controllers/clearance.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

const router = Router()

router.use(requireAuth)

router.post('/request', requireRole('student'), asyncHandler(createRequest))
router.get('/me', requireRole('student'), asyncHandler(getMine))
router.get('/me/progress', requireRole('student'), asyncHandler(getMyProgress))
router.get('/:id/pdf', asyncHandler(getPdf))

export default router
