import { Knex } from "knex";
import { app } from '../src/app'
import type { LocalStrategy } from "@feathersjs/authentication-local";
import { logger } from "../src/logger";

export async function up(knex: Knex): Promise<void> {
    let { EMAIL, PASSWORD } = process.env
    let localStrategy = app.service('authentication').getStrategy('local') as LocalStrategy
    await knex('users').insert({
        email: EMAIL,
        password: await localStrategy.hashPassword(PASSWORD!, {}),
        tenantId: 1,
        roleId: 1
    })
    logger.info(`Created default user!`)
}


export async function down(knex: Knex): Promise<void> {
}

