import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('tenants', table => {
        table.boolean('enableLogs').defaultTo(true).notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
}

