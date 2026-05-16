import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import authRoutes from './routes/auth.routes.js'
import adminRoutes from './routes/admin.routes.js'
import clearanceRoutes from './routes/clearance.routes.js'
import approvalRoutes from './routes/approval.routes.js'
import notificationRoutes from './routes/notifications.routes.js'
import requirementRoutes from './routes/requirements.routes.js'
import paymentRoutes from './payments/payment.routes.js'
import fineRoutes from './payments/fine.routes.js'
import feeRoutes from './payments/fee.routes.js'
import { notFound, errorHandler } from './middleware/error.js'

const app = express()

// Accept the configured origin OR any localhost/127.0.0.1 port — keeps dev painless
// when Vite falls back to 5174/5175 because 5173 is held by a zombie process.
const allowedOrigin = (origin, cb) => {
  if (!origin) return cb(null, true)
  if (origin === process.env.CORS_ORIGIN) return cb(null, true)
  if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return cb(null, true)
  cb(new Error(`CORS: origin ${origin} not allowed`))
}
app.use(cors({ origin: allowedOrigin, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))
app.use("/uploads", express.static("uploads"))

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/clearance', clearanceRoutes)
app.use('/api/approval', approvalRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/requirements', requirementRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/fines', fineRoutes)
app.use('/api/fees', feeRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
