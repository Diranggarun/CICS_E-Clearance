<<<<<<< HEAD
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma
=======
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
