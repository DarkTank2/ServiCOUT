// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('categories', (table) => {
    table.increments('id')

    table.string('name')
    table.integer('tenantId').notNullable()
    table.string('color')
    table.boolean('active').notNullable().defaultTo(true)
    table.unique(['name', 'tenantId'])

    table.foreign('tenantId').references('id').inTable('tenants')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('categories')
}
