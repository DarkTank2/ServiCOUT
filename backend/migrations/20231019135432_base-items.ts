// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('base-items', (table) => {
    table.increments('id')

    table.string('name').notNullable()
    table.boolean('available').defaultTo(true)
    table.integer('categoryId').notNullable()
    table.integer('tenantId').notNullable()
    table.unique(['name', 'tenantId'])

    table.foreign('categoryId').references('id').inTable('categories')
    table.foreign('tenantId').references('id').inTable('tenants')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('base-items')
}
