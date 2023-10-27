// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { CategoriesService } from './categories.class'

// Main data model schema
export const categoriesSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    color: Type.Optional(Type.String()),
    active: Type.Boolean(),
    tenantId: Type.Integer()
  },
  { $id: 'Categories', additionalProperties: false }
)
export type Categories = Static<typeof categoriesSchema>
export const categoriesValidator = getValidator(categoriesSchema, dataValidator)
export const categoriesResolver = resolve<Categories, HookContext<CategoriesService>>({})

export const categoriesExternalResolver = resolve<Categories, HookContext<CategoriesService>>({})

// Schema for creating new entries
export const categoriesDataSchema = Type.Pick(categoriesSchema, ['name', 'color', 'active', 'tenantId'], {
  $id: 'CategoriesData'
})
export type CategoriesData = Static<typeof categoriesDataSchema>
export const categoriesDataValidator = getValidator(categoriesDataSchema, dataValidator)
export const categoriesDataResolver = resolve<Categories, HookContext<CategoriesService>>({})

// Schema for updating existing entries
export const categoriesPatchSchema = Type.Partial(categoriesSchema, {
  $id: 'CategoriesPatch'
})
export type CategoriesPatch = Static<typeof categoriesPatchSchema>
export const categoriesPatchValidator = getValidator(categoriesPatchSchema, dataValidator)
export const categoriesPatchResolver = resolve<Categories, HookContext<CategoriesService>>({})

// Schema for allowed query properties
export const categoriesQueryProperties = Type.Pick(categoriesSchema, ['id', 'name', 'color', 'active', 'tenantId'])
export const categoriesQuerySchema = Type.Intersect(
  [
    querySyntax(categoriesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type CategoriesQuery = Static<typeof categoriesQuerySchema>
export const categoriesQueryValidator = getValidator(categoriesQuerySchema, queryValidator)
export const categoriesQueryResolver = resolve<CategoriesQuery, HookContext<CategoriesService>>({})
