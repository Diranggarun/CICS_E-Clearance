import { Router } from 'express'
<<<<<<< HEAD
import { listPending, approveAccount, denyAccount } from '../controllers/admin.controller.js'
=======
import { listPending, listStudents, approveAccount, denyAccount, createUser } from '../controllers/admin.controller.js'
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
import {
  dashboardStats,
  clearanceReport,
  clearanceReportCsv,
  clearanceReportPdf,
} from '../controllers/reports.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

const router = Router()

<<<<<<< HEAD
router.use(requireAuth, requireRole('bytes_officer'))

router.get('/pending-accounts', asyncHandler(listPending))
=======
// The Admin role owns the staff surface: account approval, user creation,
// records, and reports. (Previously handled by the BYTES Officer, which is
// now just an org-fee approval stage.)
router.use(requireAuth, requireRole('admin'))

router.get('/pending-accounts', asyncHandler(listPending))
router.get('/students', asyncHandler(listStudents))
router.post('/users', asyncHandler(createUser))
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
router.post('/pending-accounts/:id/approve', asyncHandler(approveAccount))
router.post('/pending-accounts/:id/deny', asyncHandler(denyAccount))

router.get('/dashboard-stats', asyncHandler(dashboardStats))
router.get('/reports/clearance', asyncHandler(clearanceReport))
router.get('/reports/clearance.csv', asyncHandler(clearanceReportCsv))
router.get('/reports/clearance.pdf', asyncHandler(clearanceReportPdf))

export default router
