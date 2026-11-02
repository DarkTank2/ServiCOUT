import { Knex } from "knex";
import { logger } from "../src/logger";


export async function up(knex: Knex): Promise<void> {
    await knex('roles').insert([
        { name: 'admin' },
        { name: 'stationary' },
        { name: 'user' }
    ])
    logger.info('Created roles.')

    await knex('tenants').insert([
        { name: 'ServiCOUT_main', currentEventName: 'No Event planned', limits: -1 }
    ])
    await knex('tenants').insert([
        { name: 'PFF36', currentEventName: 'Ball24', parentId: 1, limits: -1 }
    ])
    logger.info('Created basic tenants.')

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
    logger.info('Created basic tables.')

    await knex('sizes').insert([
        { name: '1/8l' },
        { name: '1/4l' },
        { name: '1/2l' },
        { name: '0,33l Fl.' },
        { name: '0,5l Fl.' },
        { name: 'Flasche' }
    ])
    logger.info('Created basic sizes.')
    await knex('flavours').insert([
        { name: 'pur' },
        { name: 'gspr. Wasser' },
        { name: 'gspr. Mineral' }
    ])
    logger.info('Created basic flavours.')
}


export async function down(knex: Knex): Promise<void> {
}

