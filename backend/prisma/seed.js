import 'dotenv/config'
import bcrypt from 'bcrypt'
import prisma from '../src/lib/prisma.js'

// Single shared password for the development team. Everyone should change it
// after first login. Format meets the basic complexity rule (upper + lower +
// digit + symbol, 8+ chars).
const TEAM_PASSWORD = 'Cics#2026'

<<<<<<< HEAD
// Team accounts — one per developer, all BYTES Officer so each person has
// full admin access while building. Role-specific test accounts are seeded
// separately below for end-to-end approval testing.
const TEAM = [
  // Original seed account (kept for backwards compatibility).
  { schoolId: '0000-0001', firstName: 'BYTES',       lastName: 'Officer',     email: 'bytes@cics.edu.ph',    role: 'bytes_officer', password: 'Bytes#2026' },

  // Backend devs
  { schoolId: '2026-0001', firstName: 'Affhan',      lastName: 'Mimbisa',     email: 'affhan@s.msumain.edu.ph',     role: 'bytes_officer' },
  { schoolId: '2026-0002', firstName: 'Dimalutang',  lastName: 'Amerhussein', email: 'dimalutang@s.msumain.edu.ph', role: 'bytes_officer' },
  { schoolId: '2026-0003', firstName: 'Naimah',      lastName: 'Abdulcader',  email: 'naimah@s.msumain.edu.ph',     role: 'bytes_officer' },
  { schoolId: '2026-0004', firstName: 'Asraf',       lastName: 'Alauya Jr.',  email: 'asraf@s.msumain.edu.ph',      role: 'bytes_officer' },
  { schoolId: '2026-0005', firstName: 'Landia',      lastName: 'Cherry Mae',  email: 'landia@s.msumain.edu.ph',     role: 'bytes_officer' },
  { schoolId: '2026-0006', firstName: 'Ed',          lastName: 'Arafat',      email: 'ed@s.msumain.edu.ph',         role: 'bytes_officer' },

  // Frontend devs
  { schoolId: '2026-0007', firstName: 'Norman',      lastName: 'Sharief',     email: 'norman@s.msumain.edu.ph',     role: 'bytes_officer' },
  { schoolId: '2026-0008', firstName: 'Shaheel',     lastName: 'Sarip',       email: 'shaheel@s.msumain.edu.ph',    role: 'bytes_officer' },

  // Designer
  { schoolId: '2026-0009', firstName: 'Jonaidah',    lastName: 'Caris',       email: 'jonaidah@s.msumain.edu.ph',   role: 'bytes_officer' },

  // Tech lead
  { schoolId: '2026-0010', firstName: 'Hussien',     lastName: 'Diran',       email: 'diranggarun.hg587@s.msumain.edu.ph', role: 'bytes_officer' },
]

// Role-specific accounts so the team can test the full approval pipeline.
const ROLE_TESTERS = [
  { schoolId: '2026-1001', firstName: 'Library',     lastName: 'Officer',    email: 'librarian@cics.edu.ph',    role: 'librarian' },
  { schoolId: '2026-1002', firstName: 'Faculty',     lastName: 'Adviser',    email: 'adviser@cics.edu.ph',      role: 'faculty_adviser' },
  { schoolId: '2026-1003', firstName: 'Department',  lastName: 'Chairperson', email: 'chairperson@cics.edu.ph', role: 'chairperson' },
  { schoolId: '2026-1004', firstName: 'College',     lastName: 'Dean',       email: 'dean@cics.edu.ph',         role: 'dean' },
=======
// Team accounts — one per developer, all Admin so each person has full staff
// access (account approval, reports, user creation) while building.
// Role-specific test accounts are seeded separately for approval testing.
const TEAM = [
  // Original seed account — renamed from bytes@ so it is not confused with the
  // BYTES org-fee approver role. This is a plain Admin account.
  { schoolId: '0000-0001', firstName: 'System',      lastName: 'Admin',       email: 'admin2@cics.edu.ph',   role: 'admin', password: 'Bytes#2026' },

  // Backend devs
  { schoolId: '2026-0001', firstName: 'Affhan',      lastName: 'Mimbisa',     email: 'affhan@s.msumain.edu.ph',     role: 'admin' },
  { schoolId: '2026-0002', firstName: 'Dimalutang',  lastName: 'Amerhussein', email: 'dimalutang@s.msumain.edu.ph', role: 'admin' },
  { schoolId: '2026-0003', firstName: 'Naimah',      lastName: 'Abdulcader',  email: 'naimah@s.msumain.edu.ph',     role: 'admin' },
  { schoolId: '2026-0004', firstName: 'Asraf',       lastName: 'Alauya Jr.',  email: 'asraf@s.msumain.edu.ph',      role: 'admin' },
  { schoolId: '2026-0005', firstName: 'Landia',      lastName: 'Cherry Mae',  email: 'landia@s.msumain.edu.ph',     role: 'admin' },
  { schoolId: '2026-0006', firstName: 'Ed',          lastName: 'Arafat',      email: 'ed@s.msumain.edu.ph',         role: 'admin' },

  // Frontend devs
  { schoolId: '2026-0007', firstName: 'Norman',      lastName: 'Sharief',     email: 'norman@s.msumain.edu.ph',     role: 'admin' },
  { schoolId: '2026-0008', firstName: 'Shaheel',     lastName: 'Sarip',       email: 'shaheel@s.msumain.edu.ph',    role: 'admin' },

  // Designer
  { schoolId: '2026-0009', firstName: 'Jonaidah',    lastName: 'Caris',       email: 'jonaidah@s.msumain.edu.ph',   role: 'admin' },

  // Tech lead
  { schoolId: '2026-0010', firstName: 'Hussien',     lastName: 'Diran',       email: 'diranggarun.hg587@s.msumain.edu.ph', role: 'admin' },
]

// Role-specific accounts so the team can test the full 9-stage pipeline:
// Admin -> Cursor -> Department -> BYTES -> Library -> Adviser ->
// Chairperson -> Dean -> Enrolling Faculty.
const ROLE_TESTERS = [
  { schoolId: '2026-1000', firstName: 'Clearance',   lastName: 'Admin',       email: 'admin@cics.edu.ph',        role: 'admin' },
  { schoolId: '2026-1005', firstName: 'Cursor',      lastName: 'Org Officer', email: 'cursor@cics.edu.ph',       role: 'cursor_org' },
  { schoolId: '2026-1006', firstName: 'Department',  lastName: 'Org Officer', email: 'department@cics.edu.ph',   role: 'department_org' },
  { schoolId: '2026-1007', firstName: 'BYTES',       lastName: 'Org Officer', email: 'bytesorg@cics.edu.ph',     role: 'bytes_officer' },
  { schoolId: '2026-1001', firstName: 'Library',     lastName: 'Officer',     email: 'librarian@cics.edu.ph',    role: 'librarian' },
  { schoolId: '2026-1002', firstName: 'Faculty',     lastName: 'Adviser',     email: 'adviser@cics.edu.ph',      role: 'faculty_adviser' },
  { schoolId: '2026-1003', firstName: 'Department',  lastName: 'Chairperson', email: 'chairperson@cics.edu.ph',  role: 'chairperson' },
  { schoolId: '2026-1004', firstName: 'College',     lastName: 'Dean',        email: 'dean@cics.edu.ph',         role: 'dean' },
  { schoolId: '2026-1008', firstName: 'Enrolling',   lastName: 'Faculty',     email: 'enrolling@cics.edu.ph',    role: 'enrolling_faculty' },
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
]

// Test students so anyone can walk through the student-facing flow.
const STUDENTS = [
  { schoolId: '2026-9001', firstName: 'Maria',       lastName: 'Santos',     email: 'maria.santos@s.msumain.edu.ph',  role: 'student', course: 'BSIT 4A' },
  { schoolId: '2026-9002', firstName: 'Juan',        lastName: 'Dela Cruz',  email: 'juan.delacruz@s.msumain.edu.ph', role: 'student', course: 'BSCS 4B' },
]

async function upsertUser(u) {
  const passwordHash = await bcrypt.hash(u.password || TEAM_PASSWORD, 10)
  await prisma.user.upsert({
    where: { email: u.email },
    update: {
      // Re-seeding shouldn't reset an existing password if the user changed it;
      // but it should make sure the account is approved & has the expected role.
      role: u.role,
      status: 'approved',
      firstName: u.firstName,
      lastName: u.lastName,
      schoolId: u.schoolId,
      course: u.course ?? null,
    },
    create: {
      schoolId: u.schoolId,
      role: u.role,
      firstName: u.firstName,
      lastName: u.lastName,
      sex: 'Prefer not to say',
      email: u.email,
      contactNumber: '09000000000',
      course: u.course ?? 'N/A',
      passwordHash,
      status: 'approved',
    },
  })
}

async function main() {
  const all = [...TEAM, ...ROLE_TESTERS, ...STUDENTS]
  for (const u of all) {
    await upsertUser(u)
  }

  console.log('\n=== Seeded accounts ===')
<<<<<<< HEAD
  console.log('Team (BYTES Officer access, password: ' + TEAM_PASSWORD + ' unless noted):')
=======
  console.log('Team (Admin access, password: ' + TEAM_PASSWORD + ' unless noted):')
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
  for (const u of TEAM) {
    console.log(`  ${u.email.padEnd(45)} ${u.password ? '(password: ' + u.password + ')' : ''}`)
  }
  console.log('\nRole testers (password: ' + TEAM_PASSWORD + '):')
  for (const u of ROLE_TESTERS) {
    console.log(`  ${u.email.padEnd(45)} role=${u.role}`)
  }
  console.log('\nTest students (password: ' + TEAM_PASSWORD + '):')
  for (const u of STUDENTS) {
    console.log(`  ${u.email.padEnd(45)} (${u.course})`)
  }
  console.log('\nReminder: ask the team to change their password after first login.\n')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
