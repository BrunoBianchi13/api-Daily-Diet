

import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('diets', (table) => {
    table.increments('id').primary()
    table.text('name').notNullable()
    table.text('descricao').notNullable()
    table.timestamp('data_hora').defaultTo(knex.fn.now()).notNullable()
    table.boolean('diet').notNullable()
    table.text('user_id').notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('diets')
}



