import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
  // Antes de executar o handler de cada uma das rotas verifica se o usuário está autenticado
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify() // verifica que o token está vindo
  })

  // Listagem de memórias
  app.get('/memories', async (request) => {
    console.log(request.user.sub)

    // Ordena pela data de criação da mais antiga para mais recente
    const memories = await prisma.memory.findMany({
      where: {
        userId: request.user.sub, // garante que puxe apenas as memórias do usuário logado
      },
      orderBy: { createdAt: 'asc' },
    })

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...'),
      }
    })
  })

  // Detalhe de uma memória
  app.get('/memories/:id', async (request, reply) => {
    const parmsSchema = z.object({
      id: z.string().uuid(),
    })

    // Passo os parâmetro de requisição para dentro do parmsSchema para que o zod faça uma validação
    const { id } = parmsSchema.parse(request.params)

    // Tentar encontrar, se não, dispara um erro
    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    return memory
  })

  // Criação de memória
  app.post('/memories', async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: request.user.sub,
      },
    })

    return memory
  })

  // Atualização de memória
  app.put('/memories/:id', async (request, reply) => {
    // Validação de parâmetros
    const parmsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = parmsSchema.parse(request.params)

    // Validação do corpo
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    let memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    })

    return memory
  })

  // Exclusão de memória
  app.delete('/memories/:id', async (request, reply) => {
    const parmsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = parmsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    await prisma.memory.delete({
      where: {
        id,
      },
    })
  })
}
