// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Categories, CategoriesData, CategoriesPatch, CategoriesQuery } from './categories.schema'

export type { Categories, CategoriesData, CategoriesPatch, CategoriesQuery }

export interface CategoriesParams extends KnexAdapterParams<CategoriesQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class CategoriesService<ServiceParams extends Params = CategoriesParams> extends KnexService<
  Categories,
  CategoriesData,
  CategoriesParams,
  CategoriesPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'categories'
  }
}
