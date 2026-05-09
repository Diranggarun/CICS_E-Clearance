import { verifyToken } from '../lib/jwt.js'
import prisma from '../lib/prisma.js'

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' })
  }
  try {
    const decoded = verifyToken(header.slice(7))
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } })
    if (!user) return res.status(401).json({ message: 'User no longer exists' })
    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' })
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient role' })
  }
  next()
}
