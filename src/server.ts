import fastify from "fastify";
import { env } from "./env";
import { usersRoutes } from './routes/users'
import { loginRoutes } from "./routes/login";
import cookie from '@fastify/cookie'
import { dietsRoutes } from "./routes/diets";
const app = fastify();
app.register(cookie)

app.register(usersRoutes, {
  prefix: 'users',
})
app.register(loginRoutes, {
  prefix: 'login',
})

app.register(dietsRoutes, {
  prefix: 'diets',
})




app.listen({
  port: env.PORT,
}).then(() => {
  console.log("HTTP SERVER RUNNING!")
})

