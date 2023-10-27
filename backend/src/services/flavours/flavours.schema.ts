// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { FlavoursService } from './flavours.class'

// Main data model schema
export const flavoursSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String()
  },
  { $id: 'Flavours', additionalProperties: false }
)
export type Flavours = Static<typeof flavoursSchema>
export const flavoursValidator = getValidator(flavoursSchema, dataValidator)
export const flavoursResolver = resolve<Flavours, HookContext<FlavoursService>>({})

export const flavoursExternalResolver = resolve<Flavours, HookContext<FlavoursService>>({})

// Schema for creating new entries
export const flavoursDataSchema = Type.Pick(flavoursSchema, ['name'], {
  $id: 'FlavoursData'
})
export type FlavoursData = Static<typeof flavoursDataSchema>
export const flavoursDataValidator = getValidator(flavoursDataSchema, dataValidator)
export const flavoursDataResolver = resolve<Flavours, HookContext<FlavoursService>>({})

// Schema for updating existing entries
export const flavoursPatchSchema = Type.Partial(flavoursSchema, {
  $id: 'FlavoursPatch'
})
export type FlavoursPatch = Static<typeof flavoursPatchSchema>
export const flavoursPatchValidator = getValidator(flavoursPatchSchema, dataValidator)
export const flavoursPatchResolver = resolve<Flavours, HookContext<FlavoursService>>({})

// Schema for allowed query properties
export const flavoursQueryProperties = Type.Pick(flavoursSchema, ['id', 'name'])
export const flavoursQuerySchema = Type.Intersect(
  [
    querySyntax(flavoursQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type FlavoursQuery = Static<typeof flavoursQuerySchema>
export const flavoursQueryValidator = getValidator(flavoursQuerySchema, queryValidator)
export const flavoursQueryResolver = resolve<FlavoursQuery, HookContext<FlavoursService>>({})
