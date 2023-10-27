// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ItemsHaveOptionsService } from './items-have-options.class'

// Main data model schema
export const itemsHaveOptionsSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'ItemsHaveOptions', additionalProperties: false }
)
export type ItemsHaveOptions = Static<typeof itemsHaveOptionsSchema>
export const itemsHaveOptionsValidator = getValidator(itemsHaveOptionsSchema, dataValidator)
export const itemsHaveOptionsResolver = resolve<ItemsHaveOptions, HookContext<ItemsHaveOptionsService>>({})

export const itemsHaveOptionsExternalResolver = resolve<
  ItemsHaveOptions,
  HookContext<ItemsHaveOptionsService>
>({})

// Schema for creating new entries
export const itemsHaveOptionsDataSchema = Type.Pick(itemsHaveOptionsSchema, ['text'], {
  $id: 'ItemsHaveOptionsData'
})
export type ItemsHaveOptionsData = Static<typeof itemsHaveOptionsDataSchema>
export const itemsHaveOptionsDataValidator = getValidator(itemsHaveOptionsDataSchema, dataValidator)
export const itemsHaveOptionsDataResolver = resolve<ItemsHaveOptions, HookContext<ItemsHaveOptionsService>>(
  {}
)

// Schema for updating existing entries
export const itemsHaveOptionsPatchSchema = Type.Partial(itemsHaveOptionsSchema, {
  $id: 'ItemsHaveOptionsPatch'
})
export type ItemsHaveOptionsPatch = Static<typeof itemsHaveOptionsPatchSchema>
export const itemsHaveOptionsPatchValidator = getValidator(itemsHaveOptionsPatchSchema, dataValidator)
export const itemsHaveOptionsPatchResolver = resolve<ItemsHaveOptions, HookContext<ItemsHaveOptionsService>>(
  {}
)

// Schema for allowed query properties
export const itemsHaveOptionsQueryProperties = Type.Pick(itemsHaveOptionsSchema, ['id', 'text'])
export const itemsHaveOptionsQuerySchema = Type.Intersect(
  [
    querySyntax(itemsHaveOptionsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ItemsHaveOptionsQuery = Static<typeof itemsHaveOptionsQuerySchema>
export const itemsHaveOptionsQueryValidator = getValidator(itemsHaveOptionsQuerySchema, queryValidator)
export const itemsHaveOptionsQueryResolver = resolve<
  ItemsHaveOptionsQuery,
  HookContext<ItemsHaveOptionsService>
>({})
