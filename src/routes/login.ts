import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function loginRoutes(app: FastifyInstance) {
console.log("oiiiisssss")

  app.post('/', async (request, reply) => {

     
    const userCreateSchemas = z.object({
      email: z.string(),
      password: z.string()
    })


    const { email, password } = userCreateSchemas.parse(request.body)
    console.log(email, password)
   const users = await knex.select().from('users').where({'email': email})
   console.log(users)
   // const user_id = users[0].id
    
   if (users.length == 0) {
      console.log("Objeto nao A  existe!")
    }else{
      let sessionId = request.cookies.sessionId

      if (!sessionId) {
        sessionId = randomUUID()
  
        reply.setCookie('sessionId', sessionId, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })
      }

      
     
      await knex('users')
      .update(
        {session_id: sessionId }
      ).where({email: email })
    }

    return reply.status(201).send()
  })

  

}