// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { OrderedItemHasOptionService } from './ordered-items-have-options.class'

// Main data model schema
export const orderedItemHasOptionSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'OrderedItemHasOption', additionalProperties: false }
)
export type OrderedItemHasOption = Static<typeof orderedItemHasOptionSchema>
export const orderedItemHasOptionValidator = getValidator(orderedItemHasOptionSchema, dataValidator)
export const orderedItemHasOptionResolver = resolve<
  OrderedItemHasOption,
  HookContext<OrderedItemHasOptionService>
>({})

export const orderedItemHasOptionExternalResolver = resolve<
  OrderedItemHasOption,
  HookContext<OrderedItemHasOptionService>
>({})

// Schema for creating new entries
export const orderedItemHasOptionDataSchema = Type.Pick(orderedItemHasOptionSchema, ['text'], {
  $id: 'OrderedItemHasOptionData'
})
export type OrderedItemHasOptionData = Static<typeof orderedItemHasOptionDataSchema>
export const orderedItemHasOptionDataValidator = getValidator(orderedItemHasOptionDataSchema, dataValidator)
export const orderedItemHasOptionDataResolver = resolve<
  OrderedItemHasOption,
  HookContext<OrderedItemHasOptionService>
>({})

// Schema for updating existing entries
export const orderedItemHasOptionPatchSchema = Type.Partial(orderedItemHasOptionSchema, {
  $id: 'OrderedItemHasOptionPatch'
})
export type OrderedItemHasOptionPatch = Static<typeof orderedItemHasOptionPatchSchema>
export const orderedItemHasOptionPatchValidator = getValidator(orderedItemHasOptionPatchSchema, dataValidator)
export const orderedItemHasOptionPatchResolver = resolve<
  OrderedItemHasOption,
  HookContext<OrderedItemHasOptionService>
>({})

// Schema for allowed query properties
export const orderedItemHasOptionQueryProperties = Type.Pick(orderedItemHasOptionSchema, ['id', 'text'])
export const orderedItemHasOptionQuerySchema = Type.Intersect(
  [
    querySyntax(orderedItemHasOptionQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type OrderedItemHasOptionQuery = Static<typeof orderedItemHasOptionQuerySchema>
export const orderedItemHasOptionQueryValidator = getValidator(
  orderedItemHasOptionQuerySchema,
  queryValidator
)
export const orderedItemHasOptionQueryResolver = resolve<
  OrderedItemHasOptionQuery,
  HookContext<OrderedItemHasOptionService>
>({})
