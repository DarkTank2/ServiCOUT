// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { BaseItemsService } from './base-items.class'

// Main data model schema
export const baseItemsSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    available: Type.Optional(Type.Boolean()),
    categoryId: Type.Integer(),
    tenantId: Type.Integer()
  },
  { $id: 'BaseItems', additionalProperties: false }
)
export type BaseItems = Static<typeof baseItemsSchema>
export const baseItemsValidator = getValidator(baseItemsSchema, dataValidator)
export const baseItemsResolver = resolve<BaseItems, HookContext<BaseItemsService>>({})

export const baseItemsExternalResolver = resolve<BaseItems, HookContext<BaseItemsService>>({})

// Schema for creating new entries
export const baseItemsDataSchema = Type.Pick(baseItemsSchema, ['name', 'available', 'categoryId', 'tenantId'], {
  $id: 'BaseItemsData'
})
export type BaseItemsData = Static<typeof baseItemsDataSchema>
export const baseItemsDataValidator = getValidator(baseItemsDataSchema, dataValidator)
export const baseItemsDataResolver = resolve<BaseItems, HookContext<BaseItemsService>>({})

// Schema for updating existing entries
export const baseItemsPatchSchema = Type.Partial(baseItemsSchema, {
  $id: 'BaseItemsPatch'
})
export type BaseItemsPatch = Static<typeof baseItemsPatchSchema>
export const baseItemsPatchValidator = getValidator(baseItemsPatchSchema, dataValidator)
export const baseItemsPatchResolver = resolve<BaseItems, HookContext<BaseItemsService>>({})

// Schema for allowed query properties
export const baseItemsQueryProperties = Type.Pick(baseItemsSchema, ['id', 'name', 'available', 'categoryId', 'tenantId'])
export const baseItemsQuerySchema = Type.Intersect(
  [
    querySyntax(baseItemsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type BaseItemsQuery = Static<typeof baseItemsQuerySchema>
export const baseItemsQueryValidator = getValidator(baseItemsQuerySchema, queryValidator)
export const baseItemsQueryResolver = resolve<BaseItemsQuery, HookContext<BaseItemsService>>({})
