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

// Students submit payments for themselves; BYTES sees everything via filters.
router.post('/', requireRole('student'), asyncHandler(createPayment))
router.get('/', requireRole('bytes_officer', 'student'), asyncHandler(listPayments))

router.post(
  '/upload',
  requireRole('student'),
  upload.single('receipt'),
  asyncHandler(uploadReceipt),
)

router.put('/:id/approve', requireRole('bytes_officer'), asyncHandler(approvePayment))
router.put('/:id/deny', requireRole('bytes_officer'), asyncHandler(denyPayment))

export default router
