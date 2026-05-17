import prisma from '../lib/prisma.js'

const VALID_ROLES = ['bytes_officer', 'librarian', 'faculty_adviser', 'chairperson', 'dean']

// GET /api/requirements — list all (filterable by ?role= and ?active=1)
export async function list(req, res) {
  const where = {}
  if (req.query.role) where.role = req.query.role
  if (req.query.active === '1') where.active = true
  const items = await prisma.requirement.findMany({
    where,
    orderBy: [{ role: 'asc' }, { title: 'asc' }],
  })
  res.json(items)
}

export async function create(req, res) {
  const { role, title, description } = req.body || {}
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ message: 'role must be a valid approver role.' })
  }
  if (!title?.trim()) {
    return res.status(400).json({ message: 'title is required.' })
  }
  const item = await prisma.requirement.create({
    data: { role, title: title.trim(), description: description?.trim() || null },
  })
  res.status(201).json(item)
}

export async function update(req, res) {
  const { title, description, active } = req.body || {}
  const data = {}
  if (title !== undefined) data.title = title
  if (description !== undefined) data.description = description
  if (active !== undefined) data.active = !!active
  const item = await prisma.requirement.update({ where: { id: req.params.id }, data })
  res.json(item)
}

export async function remove(req, res) {
  await prisma.requirement.delete({ where: { id: req.params.id } })
  res.json({ message: 'Requirement removed.' })
}
