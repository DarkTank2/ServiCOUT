// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  ItemsHaveOptions,
  ItemsHaveOptionsData,
  ItemsHaveOptionsPatch,
  ItemsHaveOptionsQuery
} from './items-have-options.schema'

export type { ItemsHaveOptions, ItemsHaveOptionsData, ItemsHaveOptionsPatch, ItemsHaveOptionsQuery }

export interface ItemsHaveOptionsParams extends KnexAdapterParams<ItemsHaveOptionsQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ItemsHaveOptionsService<
  ServiceParams extends Params = ItemsHaveOptionsParams
> extends KnexService<
  ItemsHaveOptions,
  ItemsHaveOptionsData,
  ItemsHaveOptionsParams,
  ItemsHaveOptionsPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'items-have-options'
  }
}
