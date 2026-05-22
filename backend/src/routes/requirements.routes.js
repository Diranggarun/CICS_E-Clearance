import { Router } from 'express'
import { list, create, update, remove } from '../controllers/requirements.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

const router = Router()

router.use(requireAuth)

router.get('/', asyncHandler(list))

// Officer roles can curate the requirements students must satisfy at their stage.
<<<<<<< HEAD
// BYTES Officer can manage all (used by Admin dashboard).
const MANAGER_ROLES = ['bytes_officer', 'librarian', 'faculty_adviser', 'chairperson', 'dean']
=======
// Admin can manage all (used by the Admin dashboard).
const MANAGER_ROLES = [
  'admin',
  'cursor_org',
  'department_org',
  'bytes_officer',
  'librarian',
  'faculty_adviser',
  'chairperson',
  'dean',
  'enrolling_faculty',
]
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
router.post('/', requireRole(...MANAGER_ROLES), asyncHandler(create))
router.put('/:id', requireRole(...MANAGER_ROLES), asyncHandler(update))
router.delete('/:id', requireRole(...MANAGER_ROLES), asyncHandler(remove))

export default router
