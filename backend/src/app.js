import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import authRoutes from './routes/auth.routes.js'
import adminRoutes from './routes/admin.routes.js'
import paymentRoutes from "./payments/payment.routes.js";
import fineRoutes from "./payments/fine.routes.js";
import feeRoutes from "./payments/fee.routes.js";


import { notFound, errorHandler } from './middleware/error.js'

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/fines", fineRoutes);
app.use("/api/fees", feeRoutes);

app.use(notFound)
app.use(errorHandler)

export default app
