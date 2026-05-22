import { Router } from 'express'
import {
  approveStage,
  denyStage,
  listPendingForRole,
  getAuditTrail,
} from '../controllers/approval.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

const router = Router()

router.use(requireAuth)

const APPROVER_ROLES = [
<<<<<<< HEAD
=======
  'admin',
  'cursor_org',
  'department_org',
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
  'bytes_officer',
  'librarian',
  'faculty_adviser',
  'chairperson',
  'dean',
<<<<<<< HEAD
=======
  'enrolling_faculty',
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
]

// Generic stage decision endpoints. The actor's role determines which stage
// they're allowed to decide on — see approval.controller.js.
router.post(
  '/:id/approve',
  requireRole(...APPROVER_ROLES),
  asyncHandler(approveStage),
)
router.post(
  '/:id/deny',
  requireRole(...APPROVER_ROLES),
  asyncHandler(denyStage),
)

router.get('/pending', requireRole(...APPROVER_ROLES), asyncHandler(listPendingForRole))
router.get('/:id/audit', asyncHandler(getAuditTrail))

export default router
