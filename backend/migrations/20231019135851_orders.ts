// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('orders', (table) => {
    table.increments('id') // maybe switch to uuid v4 in the future to not indicate the amount of orders in the system at a larger scale?!

    table.string('waiter').notNullable()
    table.integer('tableId').notNullable()
    table.integer('tenantId').notNullable()
    table.boolean('finished').defaultTo(false)
    // table.integer('userId').notNullable()

    table.timestamps(true, true, true)
    
    table.foreign('tableId').references('id').inTable('tables')
    table.foreign('tenantId').references('id').inTable('tenants')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('orders')
}
