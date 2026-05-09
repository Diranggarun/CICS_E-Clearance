import { Router } from 'express'
import { register, login, me, logout } from '../controllers/auth.controller.js'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'
import { registerSchema, loginSchema } from '../schemas/auth.schema.js'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/logout', logout)
router.get('/me', requireAuth, me)

export default router
