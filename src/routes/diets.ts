import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { checkSession } from '../middlewares/checkSession'



export async function dietsRoutes(app: FastifyInstance) {
  app.post('/', {preHandler:[checkSession]} , async (request, reply) => {

    const userCreateSchemas = z.object({
      name: z.string(),
      desc: z.string(),
      diet: z.boolean(),

    })
    const { name, desc, diet } = userCreateSchemas.parse(request.body)
    let sessionId = request.cookies.sessionId

    const users = await knex.select().from('users').where({'session_id': sessionId})
    const user_id = users[0].id
    console.log(user_id)


    await knex('diets').insert({
      name: name,
      descricao: desc,
      diet: diet,
      user_id: user_id
      
    })

    return reply.status(201).send()
  })



  app.put('/:id',{preHandler:[checkSession]} , async (request,reply) => {

  let sessionId = request.cookies.sessionId
  

    const getSchemas = z.object({
      id: z.string()

    })

    const updateSchemas = z.object({
      name: z.string(),
      desc: z.string(),
      diet: z.boolean()

    })

    const {id} = getSchemas.parse(request.params)
    const { name, desc, diet } = updateSchemas.parse(request.body)
    

    const users = await knex.select().from('users').where({'session_id': sessionId}).first()
    const user_id = users.id

    const diets = await knex.select().from('diets').where('user_id', user_id).andWhere('id', id)



    const dataAtual = new Date();

    const novaData = new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'long',
      timeZone: 'America/Belem',
  });

    await knex('diets')
    .update(
      {name: name, descricao: desc ,data_hora: novaData.format(dataAtual),  diet: diet}
    ).where({id: id})
    
    return  reply.status(201).send("Registro atualizado com sucesso!!!")
  })



  app.delete('/:id',{preHandler:[checkSession]} , async (request, reply) => {

    let sessionId = request.cookies.sessionId

    const getSchemas = z.object({
      id: z.string()

    })

    const {id} = getSchemas.parse(request.params)

    const users = await knex.select().from('users').where({'session_id': sessionId}).first()
    const user_id = users.id

    const diets = await knex.select().from('diets').where('user_id', user_id).andWhere('id', id).first()


    if (!diets.id) {
      return reply.status(401).send({
        error: 'Não existe dieta com esse id registrado no sistema !!!',
      })
    }
    


    await knex("diets").where({id}).delete()

    return reply.status(201).send()
  })



  app.get('/', {preHandler:[checkSession]} ,async (request, reply) => {

    let sessionId = request.cookies.sessionId

    const users = await knex.select().from('users').where({'session_id': sessionId}).first()
    const user_id = users.id

    const diets = await knex.select().from('diets').where('user_id', user_id)

    return reply.status(201).send(diets)
  })

  app.get('/:id', {preHandler:[checkSession]} , async (request, reply) => {

    let sessionId = request.cookies.sessionId
    const getSchemas = z.object({
      id: z.string()

    })

    const {id} = getSchemas.parse(request.params)

    const users = await knex.select().from('users').where({'session_id': sessionId}).first()
    const user_id = users.id

    const diets = await knex.select().from('diets').where('user_id', user_id).andWhere('id', id).first()

    return reply.status(201).send(diets)
  })


  app.get('/summary',{preHandler:[checkSession]} , async (request, reply) => {

    let sessionId = request.cookies.sessionId
    const users = await knex.select().from('users').where({'session_id': sessionId}).first()
    const user_id = users.id

    const diets = await knex.select().from('diets').where('user_id', user_id)

    console.log(diets.length)
    let dentro_dieta = 0
    let fora_dieta = 0
    for (let index = 0; index < diets.length; index++) {
      if (diets[index].diet == 0) {
        dentro_dieta = dentro_dieta +1
      }else if(diets[index].diet == 1){
        fora_dieta = fora_dieta +1
      }
    }

  

    return reply.send(`Historico do ${users.name}:

Total de refeições cadastradas: ${diets.length};
Total de refeições dentro da dietas: ${dentro_dieta};
Total de refeições fora da dietas: ${fora_dieta};`)
  })
}
//"Historico do " + users.name + "
