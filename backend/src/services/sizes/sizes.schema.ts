// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { SizesService } from './sizes.class'

// Main data model schema
export const sizesSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'Sizes', additionalProperties: false }
)
export type Sizes = Static<typeof sizesSchema>
export const sizesValidator = getValidator(sizesSchema, dataValidator)
export const sizesResolver = resolve<Sizes, HookContext<SizesService>>({})

export const sizesExternalResolver = resolve<Sizes, HookContext<SizesService>>({})

// Schema for creating new entries
export const sizesDataSchema = Type.Pick(sizesSchema, ['text'], {
  $id: 'SizesData'
})
export type SizesData = Static<typeof sizesDataSchema>
export const sizesDataValidator = getValidator(sizesDataSchema, dataValidator)
export const sizesDataResolver = resolve<Sizes, HookContext<SizesService>>({})

// Schema for updating existing entries
export const sizesPatchSchema = Type.Partial(sizesSchema, {
  $id: 'SizesPatch'
})
export type SizesPatch = Static<typeof sizesPatchSchema>
export const sizesPatchValidator = getValidator(sizesPatchSchema, dataValidator)
export const sizesPatchResolver = resolve<Sizes, HookContext<SizesService>>({})

// Schema for allowed query properties
export const sizesQueryProperties = Type.Pick(sizesSchema, ['id', 'text'])
export const sizesQuerySchema = Type.Intersect(
  [
    querySyntax(sizesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type SizesQuery = Static<typeof sizesQuerySchema>
export const sizesQueryValidator = getValidator(sizesQuerySchema, queryValidator)
export const sizesQueryResolver = resolve<SizesQuery, HookContext<SizesService>>({})
