import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import { signToken } from '../lib/jwt.js';

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
});

export async function register(req, res) {
  const b = req.body;

  const existsEmail = await prisma.user.findUnique({ where: { email: b.email } });
  if (existsEmail) return res.status(409).json({ message: 'Email already registered' });

  const existsId = await prisma.user.findUnique({ where: { schoolId: b.id_number } });
  if (existsId) return res.status(409).json({ message: 'School ID already registered' });

  const passwordHash = await bcrypt.hash(b.password, 10);

  const user = await prisma.user.create({
    data: {
      schoolId: b.id_number,
      role: b.role || 'student',
      firstName: b.first_name,
      middleName: b.middle_name || null,
      lastName: b.last_name,
      sex: b.gender,
      birthdate: b.date_of_birth ? new Date(b.date_of_birth) : null,
      email: b.email,
      contactNumber: b.contact_number,
      course: b.course,
      college: b.college || null,
      department: b.department || null,
      passwordHash,
      status: 'approved', 
    },
  });

  return res.status(201).json({
    message: 'Account created successfully.',
    user: publicUser(user),
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    // 1. Locate the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`❌ Login failed: User with email ${email} not found.`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // -------------------------------------------------------------
    // TEMPORARY BYPASS: Accept Cics#2026 or fallback verification
    // Remove or revert this before deployment!
    // -------------------------------------------------------------
    const isTestPassword = (password === 'Cics#2026');
    const matchesDatabaseHash = await bcrypt.compare(password, user.passwordHash).catch(() => false);

    if (!isTestPassword && !matchesDatabaseHash) {
      console.log(`❌ Login failed: Password mismatch for ${email}.`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // -------------------------------------------------------------

    // 3. Status validation gates
    if (user.status === 'pending') {
      return res.status(403).json({ message: 'Account is pending BYTES Officer approval' });
    }
    if (user.status === 'denied') {
      return res.status(403).json({ message: 'Account was denied. Contact the BYTES Office.' });
    }

    // 4. Issue signature token
    const access_token = signToken({ sub: user.id, role: user.role });
    console.log(`✅ BYPASS LOGIN SUCCESSFUL: ${email} (${user.role})`);
    
    return res.json({ 
      access_token, 
      user: publicUser(user) 
    });
  } catch (error) {
    console.error('Prisma Login Controller Crash:', error);
    return res.status(500).json({ message: error.message });
  }
}

export async function me(req, res) {
  return res.json({ user: publicUser(req.user) });
}

export async function logout(_req, res) {
  return res.json({ message: 'Logged out successfully' });
}