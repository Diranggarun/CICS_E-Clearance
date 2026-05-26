import { Router } from 'express'
import { listPending, listStudents, approveAccount, denyAccount, createUser } from '../controllers/admin.controller.js'
import {
  dashboardStats,
  clearanceReport,
  clearanceReportCsv,
  clearanceReportPdf,
} from '../controllers/reports.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

const router = Router()

// The Admin role owns the staff surface: account approval, user creation,
// records, and reports. (Previously handled by the BYTES Officer, which is
// now just an org-fee approval stage.)
router.use(requireAuth, requireRole('admin'))

router.get('/pending-accounts', asyncHandler(listPending))
router.get('/students', asyncHandler(listStudents))
router.post('/users', asyncHandler(createUser))
router.post('/pending-accounts/:id/approve', asyncHandler(approveAccount))
router.post('/pending-accounts/:id/deny', asyncHandler(denyAccount))

router.get('/dashboard-stats', asyncHandler(dashboardStats))
router.get('/reports/clearance', asyncHandler(clearanceReport))
router.get('/reports/clearance.csv', asyncHandler(clearanceReportCsv))
router.get('/reports/clearance.pdf', asyncHandler(clearanceReportPdf))

export default router
