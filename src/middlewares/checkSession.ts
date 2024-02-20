import { FastifyReply, FastifyRequest } from 'fastify'


export async function checkSession(request: FastifyRequest,reply: FastifyReply,){
  let sessionId = request.cookies.sessionId
    if (!sessionId) {
      return reply.status(401).send({
        error: 'Vocé precisa esta logado para realizar essa ação!!!',
      })
    }
}