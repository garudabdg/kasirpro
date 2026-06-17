import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
// Using globalThis to avoid memory leaks during hot-reloads if applicable
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
