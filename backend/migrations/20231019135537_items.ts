// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('items', (table) => {
    table.increments('id')

    table.float('price').notNullable()
    table.boolean('default').notNullable().defaultTo(false)
    table.integer('baseItemId').notNullable()
    table.integer('sizeId').notNullable()
    table.integer('flavourId').notNullable()
    table.unique(['baseItemId', 'sizeId', 'flavourId'], { indexName: 'items_baseItem_size_flavour_constraint', useConstraint: true })

    table.foreign('baseItemId').references('id').inTable('base-items')
    table.foreign('sizeId').references('id').inTable('sizes')
    table.foreign('flavourId').references('id').inTable('flavours')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('items')
}
