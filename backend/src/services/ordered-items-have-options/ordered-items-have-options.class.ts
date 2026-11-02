// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  OrderedItemHasOption,
  OrderedItemHasOptionData,
  OrderedItemHasOptionPatch,
  OrderedItemHasOptionQuery
} from './ordered-items-have-options.schema'

export type {
  OrderedItemHasOption,
  OrderedItemHasOptionData,
  OrderedItemHasOptionPatch,
  OrderedItemHasOptionQuery
}

export interface OrderedItemHasOptionParams extends KnexAdapterParams<OrderedItemHasOptionQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class OrderedItemHasOptionService<
  ServiceParams extends Params = OrderedItemHasOptionParams
> extends KnexService<
  OrderedItemHasOption,
  OrderedItemHasOptionData,
  OrderedItemHasOptionParams,
  OrderedItemHasOptionPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'ordered-items-have-options'
  }
}
