// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('ordered-items-have-options', (table) => {
    table.primary(['orderedItemId', 'optionId'])
    table.integer('orderedItemId').notNullable()
    table.integer('optionId').notNullable()

    table.foreign('orderedItemId').references('id').inTable('ordered-items')
    table.foreign('optionsId').references('id').inTable('options')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('ordered-items-have-options')
}
