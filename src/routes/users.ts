import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance) {

  app.post('/', async (request, reply) => {

     
    const userCreateSchemas = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string()
    })


    const { name, email, password } = userCreateSchemas.parse(request.body)

    await knex('users').insert({
      name: name,
      email: email,
      password: password
    })

    return reply.status(201).send()
  })

  

}