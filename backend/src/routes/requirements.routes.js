import { Router } from 'express'
import { list, create, update, remove } from '../controllers/requirements.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

const router = Router()

router.use(requireAuth)

router.get('/', asyncHandler(list))

// Officer roles can curate the requirements students must satisfy at their stage.
// BYTES Officer can manage all (used by Admin dashboard).
const MANAGER_ROLES = ['bytes_officer', 'librarian', 'faculty_adviser', 'chairperson', 'dean']
router.post('/', requireRole(...MANAGER_ROLES), asyncHandler(create))
router.put('/:id', requireRole(...MANAGER_ROLES), asyncHandler(update))
router.delete('/:id', requireRole(...MANAGER_ROLES), asyncHandler(remove))

export default router
