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

<<<<<<< HEAD
// Students submit payments for themselves; BYTES sees everything via filters.
router.post('/', requireRole('student'), asyncHandler(createPayment))
router.get('/', requireRole('bytes_officer', 'student'), asyncHandler(listPayments))
=======
// Admin + the three org-fee officers verify payments; the controller scopes
// each officer to their own organization's fee payments.
const VERIFIER_ROLES = ['admin', 'cursor_org', 'department_org', 'bytes_officer']

// Students submit payments for themselves; verifiers see them via filters.
router.post('/', requireRole('student'), asyncHandler(createPayment))
router.get('/', requireRole('student', ...VERIFIER_ROLES), asyncHandler(listPayments))
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e

router.post(
  '/upload',
  requireRole('student'),
  upload.single('receipt'),
  asyncHandler(uploadReceipt),
)

<<<<<<< HEAD
router.put('/:id/approve', requireRole('bytes_officer'), asyncHandler(approvePayment))
router.put('/:id/deny', requireRole('bytes_officer'), asyncHandler(denyPayment))
=======
router.put('/:id/approve', requireRole(...VERIFIER_ROLES), asyncHandler(approvePayment))
router.put('/:id/deny', requireRole(...VERIFIER_ROLES), asyncHandler(denyPayment))
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e

export default router
