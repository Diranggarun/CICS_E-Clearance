import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js'
import { signToken } from '../lib/jwt.js'

const publicUser = (u) => ({
  id: u.id,
  school_id: u.schoolId,
  role: u.role,
  first_name: u.firstName,
  middle_name: u.middleName,
  last_name: u.lastName,
  email: u.email,
  course: u.course,
  status: u.status,
})

export async function register(req, res) {
  const b = req.body

  const existsEmail = await prisma.user.findUnique({ where: { email: b.email } })
  if (existsEmail) return res.status(409).json({ message: 'Email already registered' })

  const existsId = await prisma.user.findUnique({ where: { schoolId: b.id_number } })
  if (existsId) return res.status(409).json({ message: 'School ID already registered' })

  const passwordHash = await bcrypt.hash(b.password, 10)

  const user = await prisma.user.create({
    data: {
      schoolId: b.id_number,
      role: b.role || 'student',
      firstName: b.first_name,
      middleName: b.middle_name || null,
      lastName: b.last_name,
      sex: b.gender,
      birthdate: new Date(b.date_of_birth),
      email: b.email,
      contactNumber: b.contact_number,
      course: b.course,
      college: b.college || null,
      department: b.department || null,
      passwordHash,
      status: 'pending',
    },
  })

  return res.status(201).json({
    message: 'Account created. Awaiting BYTES Officer approval.',
    user: publicUser(user),
  })
}

export async function login(req, res) {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

  if (user.status === 'pending') {
    return res.status(403).json({ message: 'Account is pending BYTES Officer approval' })
  }
  if (user.status === 'denied') {
    return res.status(403).json({ message: 'Account was denied. Contact the BYTES Office.' })
  }

  const access_token = signToken({ sub: user.id, role: user.role })
  return res.json({ access_token, user: publicUser(user) })
}

export async function me(req, res) {
  return res.json({ user: publicUser(req.user) })
}

export async function logout(_req, res) {
  // Stateless JWT — client just drops the token. Endpoint kept for symmetry.
  return res.json({ message: 'Logged out' })
}
