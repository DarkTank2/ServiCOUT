// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('items-have-options', (table) => {
    table.increments('id')
    
    table.integer('itemId').notNullable()
    table.integer('optionId').notNullable()
    table.integer('tenantId').notNullable()
    table.unique(['itemId', 'optionId', 'tenantId'], { indexName: 'iho_iId_oId_tId_constraint', useConstraint: true })

    table.foreign('itemId').references('id').inTable('items')
    table.foreign('optionId').references('id').inTable('options')
    table.foreign('tenantId').references('id').inTable('tenants')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('items-have-options')
}
