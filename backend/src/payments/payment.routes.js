import express from 'express'
import {
  createPayment,
  listPayments,
  approvePayment,
  denyPayment,
  uploadReceipt,
} from './payment.controller.js'
import { upload } from '../lib/upload.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

const router = express.Router()

router.use(requireAuth)

// Admin + the three org-fee officers verify payments; the controller scopes
// each officer to their own organization's fee payments.
const VERIFIER_ROLES = ['admin', 'cursor_org', 'department_org', 'bytes_officer']

// Students submit payments for themselves; verifiers see them via filters.
router.post('/', requireRole('student'), asyncHandler(createPayment))
router.get('/', requireRole('student', ...VERIFIER_ROLES), asyncHandler(listPayments))

router.post(
  '/upload',
  requireRole('student'),
  upload.single('receipt'),
  asyncHandler(uploadReceipt),
)

router.put('/:id/approve', requireRole(...VERIFIER_ROLES), asyncHandler(approvePayment))
router.put('/:id/deny', requireRole(...VERIFIER_ROLES), asyncHandler(denyPayment))

export default router
