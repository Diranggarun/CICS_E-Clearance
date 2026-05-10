import { z } from 'zod'

export const registerSchema = z.object({
  id_number: z.string().regex(/^\d{4}-\d{4,6}$/, 'School ID must look like 2024-00000'),
  course: z.string().min(2),
  first_name: z.string().min(1),
  middle_name: z.string().optional().nullable(),
  last_name: z.string().min(1),
  gender: z.string().min(1),
  date_of_birth: z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid date'),
  contact_number: z.string().min(7),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'librarian', 'faculty_adviser', 'chairperson', 'dean']).optional(),
  college: z.string().optional(),
  department: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
