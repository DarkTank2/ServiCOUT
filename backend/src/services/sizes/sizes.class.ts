// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Sizes, SizesData, SizesPatch, SizesQuery } from './sizes.schema'

export type { Sizes, SizesData, SizesPatch, SizesQuery }

export interface SizesParams extends KnexAdapterParams<SizesQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class SizesService<ServiceParams extends Params = SizesParams> extends KnexService<
  Sizes,
  SizesData,
  SizesParams,
  SizesPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'sizes'
  }
}
