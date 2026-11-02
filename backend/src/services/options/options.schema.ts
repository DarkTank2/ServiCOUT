// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { OptionService } from './options.class'

// Main data model schema
export const optionSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    priceAddition: Type.Number(),
    default: Type.Boolean(),
    tenantId: Type.Integer()
  },
  { $id: 'Option', additionalProperties: false }
)
export type Option = Static<typeof optionSchema>
export const optionValidator = getValidator(optionSchema, dataValidator)
export const optionResolver = resolve<Option, HookContext<OptionService>>({})

export const optionExternalResolver = resolve<Option, HookContext<OptionService>>({})

// Schema for creating new entries
export const optionDataSchema = Type.Pick(optionSchema, ['name', 'priceAddition', 'default', 'tenantId'], {
  $id: 'OptionData'
})
export type OptionData = Static<typeof optionDataSchema>
export const optionDataValidator = getValidator(optionDataSchema, dataValidator)
export const optionDataResolver = resolve<Option, HookContext<OptionService>>({})

// Schema for updating existing entries
export const optionPatchSchema = Type.Partial(optionSchema, {
  $id: 'OptionPatch'
})
export type OptionPatch = Static<typeof optionPatchSchema>
export const optionPatchValidator = getValidator(optionPatchSchema, dataValidator)
export const optionPatchResolver = resolve<Option, HookContext<OptionService>>({})

// Schema for allowed query properties
export const optionQueryProperties = Type.Pick(optionSchema, ['id', 'name', 'priceAddition', 'default', 'tenantId'])
export const optionQuerySchema = Type.Intersect(
  [
    querySyntax(optionQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type OptionQuery = Static<typeof optionQuerySchema>
export const optionQueryValidator = getValidator(optionQuerySchema, queryValidator)
export const optionQueryResolver = resolve<OptionQuery, HookContext<OptionService>>({})
