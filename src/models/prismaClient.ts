import { PrismaClient } from '@prisma/client';

type GlobalForPrisma = {
    prisma?: PrismaClient;
};

// usamos globalThis para evitar problemas de nombres en distintos entornos
const globalForPrisma = globalThis as unknown as GlobalForPrisma;

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;