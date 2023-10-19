// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { BaseItems, BaseItemsData, BaseItemsPatch, BaseItemsQuery } from './base-items.schema'

export type { BaseItems, BaseItemsData, BaseItemsPatch, BaseItemsQuery }

export interface BaseItemsParams extends KnexAdapterParams<BaseItemsQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class BaseItemsService<ServiceParams extends Params = BaseItemsParams> extends KnexService<
  BaseItems,
  BaseItemsData,
  BaseItemsParams,
  BaseItemsPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'base-items'
  }
}
