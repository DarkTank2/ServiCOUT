// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('ordered-items', (table) => {
    table.increments('id')

    table.integer('quantity').notNullable()
    table.boolean('finished').defaultTo(false)
    table.integer('cashed').defaultTo(0)
    table.string('waiter').notNullable()
    table.string('comment')
    
    table.integer('itemId').notNullable()
    table.integer('tableId').notNullable()
    table.integer('tenantId').notNullable()
    // table.integer('userId').notNullable()
    table.timestamps(true, true, true)

    table.foreign('itemId').references('id').inTable('items')
    table.foreign('tableId').references('id').inTable('tables')
    table.foreign('tenantId').references('id').inTable('tenants')
    // table.foreign('userId').references('id').inTable('users')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('ordered-items')
}
