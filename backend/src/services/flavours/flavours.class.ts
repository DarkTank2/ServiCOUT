// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Flavours, FlavoursData, FlavoursPatch, FlavoursQuery } from './flavours.schema'

export type { Flavours, FlavoursData, FlavoursPatch, FlavoursQuery }

export interface FlavoursParams extends KnexAdapterParams<FlavoursQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class FlavoursService<ServiceParams extends Params = FlavoursParams> extends KnexService<
  Flavours,
  FlavoursData,
  FlavoursParams,
  FlavoursPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'flavours'
  }
}
