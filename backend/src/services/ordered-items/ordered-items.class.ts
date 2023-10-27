// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  OrderedItems,
  OrderedItemsData,
  OrderedItemsPatch,
  OrderedItemsQuery
} from './ordered-items.schema'

export type { OrderedItems, OrderedItemsData, OrderedItemsPatch, OrderedItemsQuery }

export interface OrderedItemsParams extends KnexAdapterParams<OrderedItemsQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class OrderedItemsService<ServiceParams extends Params = OrderedItemsParams> extends KnexService<
  OrderedItems,
  OrderedItemsData,
  OrderedItemsParams,
  OrderedItemsPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'ordered-items'
  }
}
