// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Option, OptionData, OptionPatch, OptionQuery } from './options.schema'

export type { Option, OptionData, OptionPatch, OptionQuery }

export interface OptionParams extends KnexAdapterParams<OptionQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class OptionService<ServiceParams extends Params = OptionParams> extends KnexService<
  Option,
  OptionData,
  OptionParams,
  OptionPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'options'
  }
}
