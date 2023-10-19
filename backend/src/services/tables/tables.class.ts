// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Tables, TablesData, TablesPatch, TablesQuery } from './tables.schema'

export type { Tables, TablesData, TablesPatch, TablesQuery }

export interface TablesParams extends KnexAdapterParams<TablesQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class TablesService<ServiceParams extends Params = TablesParams> extends KnexService<
  Tables,
  TablesData,
  TablesParams,
  TablesPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'tables'
  }
}
