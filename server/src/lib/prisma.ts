import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  // Exibe todas as queries que são executadas
  log: ['query'],
})
