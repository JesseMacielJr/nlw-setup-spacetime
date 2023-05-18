import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'
const app = fastify()

app.register(cors, {
  origin: true, // todas URLs de front-end poderão acessar nosso back-end
  // origin: ['http://localhost:3000'],
})
app.register(jwt, {
  secret:
    'kahetlkw4h6klht2k5lekrj35h32k5heheklwthh625kh235k23623yeklthwklwtsegbcmgpw', // maneira de diferenciar os tokens de outros JWT gerados por outros back-ends
})
// Registra um arquivo de rotas separado
app.register(memoriesRoutes)
app.register(authRoutes)

// Criação do servidor HTTP
app
  .listen({
    port: 3333,
    host: '::',
  })
  .then(() => {
    console.log('HTTP server running on http://localhost:3333')
  })
