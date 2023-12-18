// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('ordered-items', (table) => {
    table.increments('id')

    table.integer('quantity').notNullable()
    table.boolean('finished').defaultTo(false) // is finished preparing?
    table.integer('cashed').defaultTo(0) // amount already cashed
    table.boolean('fullyCashed').defaultTo(false) // indicates if the OI is already fully cashed and thus can be omitted in queries by this field
    table.string('comment')
    
    table.integer('itemId').notNullable()
    table.integer('tenantId').notNullable()
    table.integer('orderId').notNullable()
    
    table.timestamps(true, true, true)

    table.foreign('itemId').references('id').inTable('items')
    table.foreign('tenantId').references('id').inTable('tenants')
    table.foreign('orderId').references('id').inTable('orders')
    // table.foreign('userId').references('id').inTable('users')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('ordered-items')
}
