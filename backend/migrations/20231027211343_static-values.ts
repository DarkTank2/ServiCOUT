import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex('roles').insert([
        { name: 'admin' },
        { name: 'stationary' },
        { name: 'user' }
    ])

    await knex('tables').insert([
        { name: 'Tisch #1' },
        { name: 'Tisch #2' },
        { name: 'Tisch #3' },
        { name: 'Tisch #4' },
        { name: 'Tisch #5' },
        { name: 'Tisch #6' },
        { name: 'Tisch #7' },
        { name: 'Tisch #8' },
        { name: 'Tisch #9' },
        { name: 'Tisch #10' },
        { name: 'Tisch #11' },
        { name: 'Tisch #12' },
        { name: 'Tisch #13' },
        { name: 'Tisch #14' },
        { name: 'Tisch #15' },
        { name: 'Tisch #16' },
        { name: 'Tisch #17' },
        { name: 'Tisch #18' }
    ])

    await knex('sizes').insert([])
    await knex('flavours').insert([])
}


export async function down(knex: Knex): Promise<void> {
}

