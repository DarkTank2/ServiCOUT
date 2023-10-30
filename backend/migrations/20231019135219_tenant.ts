// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tenants', (table) => {
    table.increments('id')

    table.string('name').notNullable()
    table.string('currentEventName')
    // limits for items or baseItems, not decided yet
    // additionally the limits are not takeninto account yet since it is planned for commercialization
    table.integer('limits').defaultTo(10)
    
    table.integer('parentId')
    
    table.foreign('parentId').references('id').inTable('tenants')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tenants')
}
