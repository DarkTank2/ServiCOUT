// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { OrderedItemsService } from './ordered-items.class'

// Main data model schema
export const orderedItemsSchema = Type.Object(
  {
    id: Type.Number(),
    quantity: Type.Integer(),
    error: Type.Optional(Type.Boolean()),
    cashed: Type.Optional(Type.Integer()),
    fullyCashed: Type.Optional(Type.Boolean()),
    comment: Type.Optional(Type.String()),
    itemId: Type.Integer(),
    orderId: Type.Integer(),
    tenantId: Type.Integer(),
    createdAt: Type.Optional(Type.String({ format: 'date-time' })),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'OrderedItems', additionalProperties: false }
)
export type OrderedItems = Static<typeof orderedItemsSchema>
export const orderedItemsValidator = getValidator(orderedItemsSchema, dataValidator)
export const orderedItemsResolver = resolve<OrderedItems, HookContext<OrderedItemsService>>({})

export const orderedItemsExternalResolver = resolve<OrderedItems, HookContext<OrderedItemsService>>({})

// Schema for creating new entries
export const orderedItemsDataSchema = Type.Pick(orderedItemsSchema, ['quantity', 'error', 'cashed', 'fullyCashed', 'comment', 'itemId', 'orderId', 'tenantId', 'createdAt', 'updatedAt'], {
  $id: 'OrderedItemsData'
})
export type OrderedItemsData = Static<typeof orderedItemsDataSchema>
export const orderedItemsDataValidator = getValidator(orderedItemsDataSchema, dataValidator)
export const orderedItemsDataResolver = resolve<OrderedItems, HookContext<OrderedItemsService>>({})

// Schema for updating existing entries
export const orderedItemsPatchSchema = Type.Partial(orderedItemsSchema, {
  $id: 'OrderedItemsPatch'
})
export type OrderedItemsPatch = Static<typeof orderedItemsPatchSchema>
export const orderedItemsPatchValidator = getValidator(orderedItemsPatchSchema, dataValidator)
export const orderedItemsPatchResolver = resolve<OrderedItems, HookContext<OrderedItemsService>>({})

// Schema for allowed query properties
export const orderedItemsQueryProperties = Type.Pick(orderedItemsSchema, ['id', 'error', 'cashed', 'fullyCashed', 'itemId', 'orderId', 'tenantId', 'createdAt', 'updatedAt'])
export const orderedItemsQuerySchema = Type.Intersect(
  [
    querySyntax(orderedItemsQueryProperties),
    // Add additional query properties here
    Type.Object({
      'order.finished': Type.Optional(Type.Boolean())
    }, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type OrderedItemsQuery = Static<typeof orderedItemsQuerySchema>
export const orderedItemsQueryValidator = getValidator(orderedItemsQuerySchema, queryValidator)
export const orderedItemsQueryResolver = resolve<OrderedItemsQuery, HookContext<OrderedItemsService>>({})
