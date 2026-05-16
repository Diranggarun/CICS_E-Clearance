import prisma from '../lib/prisma.js'

// GET /api/notifications — feed for the current user.
// Query: ?unread=1 to filter, ?limit=50 (default 50, max 200).
export async function listMine(req, res) {
  const limit = Math.min(Number(req.query.limit) || 50, 200)
  const where = { userId: req.user.id }
  if (req.query.unread === '1') where.readAt = null

  const [items, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
    prisma.notification.count({ where: { userId: req.user.id, readAt: null } }),
  ])

  res.json({ items, unread_count: unreadCount })
}

// POST /api/notifications/:id/read — mark a single notification read.
export async function markRead(req, res) {
  const { id } = req.params
  const result = await prisma.notification.updateMany({
    where: { id, userId: req.user.id, readAt: null },
    data: { readAt: new Date() },
  })
  if (result.count === 0) {
    return res.status(404).json({ message: 'Notification not found or already read.' })
  }
  res.json({ message: 'Marked read.' })
}

// POST /api/notifications/read-all — mark every unread notification read.
export async function markAllRead(req, res) {
  const result = await prisma.notification.updateMany({
    where: { userId: req.user.id, readAt: null },
    data: { readAt: new Date() },
  })
  res.json({ message: 'All marked read.', count: result.count })
}
