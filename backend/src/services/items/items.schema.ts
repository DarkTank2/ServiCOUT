// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ItemsService } from './items.class'

// Main data model schema
export const itemsSchema = Type.Object(
  {
    id: Type.Number(),
    price: Type.Number(),
    default: Type.Boolean(),
    baseItemId: Type.Integer(),
    sizeId: Type.Optional(Type.Integer()),
    flavourId: Type.Optional(Type.Integer())
  },
  { $id: 'Items', additionalProperties: false }
)
export type Items = Static<typeof itemsSchema>
export const itemsValidator = getValidator(itemsSchema, dataValidator)
export const itemsResolver = resolve<Items, HookContext<ItemsService>>({})

export const itemsExternalResolver = resolve<Items, HookContext<ItemsService>>({})

// Schema for creating new entries
export const itemsDataSchema = Type.Pick(itemsSchema, ['price', 'default', 'baseItemId', 'sizeId', 'flavourId'], {
  $id: 'ItemsData'
})
export type ItemsData = Static<typeof itemsDataSchema>
export const itemsDataValidator = getValidator(itemsDataSchema, dataValidator)
export const itemsDataResolver = resolve<Items, HookContext<ItemsService>>({})

// Schema for updating existing entries
export const itemsPatchSchema = Type.Partial(itemsSchema, {
  $id: 'ItemsPatch'
})
export type ItemsPatch = Static<typeof itemsPatchSchema>
export const itemsPatchValidator = getValidator(itemsPatchSchema, dataValidator)
export const itemsPatchResolver = resolve<Items, HookContext<ItemsService>>({})

// Schema for allowed query properties
export const itemsQueryProperties = Type.Pick(itemsSchema, ['price', 'default', 'baseItemId', 'sizeId', 'flavourId'])
export const itemsQuerySchema = Type.Intersect(
  [
    querySyntax(itemsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ItemsQuery = Static<typeof itemsQuerySchema>
export const itemsQueryValidator = getValidator(itemsQuerySchema, queryValidator)
export const itemsQueryResolver = resolve<ItemsQuery, HookContext<ItemsService>>({})
