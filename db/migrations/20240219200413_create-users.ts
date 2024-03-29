import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.text('name').notNullable()
    table.text('email').notNullable()
    table.text('password').notNullable()
    table.text('session_id')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')

}



