import { Router } from 'express'
import { listMine, markRead, markAllRead } from '../controllers/notifications.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

const router = Router()

router.use(requireAuth)

router.get('/', asyncHandler(listMine))
router.post('/:id/read', asyncHandler(markRead))
router.post('/read-all', asyncHandler(markAllRead))

export default router
