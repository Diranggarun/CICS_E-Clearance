import 'dotenv/config'
import bcrypt from 'bcrypt'
import prisma from '../src/lib/prisma.js'

async function main() {
  const email = 'bytes@cics.edu.ph'
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log('Seed BYTES Officer already exists:', email)
    return
  }
  const passwordHash = await bcrypt.hash('Bytes#2026', 10)
  await prisma.user.create({
    data: {
      schoolId: '0000-0001',
      role: 'bytes_officer',
      firstName: 'BYTES',
      lastName: 'Officer',
      sex: 'Prefer not to say',
      email,
      contactNumber: '09000000000',
      course: 'N/A',
      passwordHash,
      status: 'approved',
    },
  })
  console.log('Seeded BYTES Officer:')
  console.log('  email:    bytes@cics.edu.ph')
  console.log('  password: Bytes#2026')
}

main().finally(() => prisma.$disconnect())
