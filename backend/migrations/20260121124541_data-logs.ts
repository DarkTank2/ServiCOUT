import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('data-logs', (table) => {
        table.increments('id') // maybe switch to uuid v4 in the future to not indicate the amount of orders in the system at a larger scale?!

        table.string('service').notNullable()
        table.string('method').notNullable()
        table.integer('entityId').notNullable()
        table.json('diff')
        table.integer('userId').notNullable()
        table.integer('tenantId').notNullable()
        
        table.timestamps(true, true, true)

        table.foreign('userId').references('id').inTable('users')
        table.foreign('tenantId').references('id').inTable('tenants')
    })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('data-logs')
}

