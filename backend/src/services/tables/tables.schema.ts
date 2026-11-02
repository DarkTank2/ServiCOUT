// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { TablesService } from './tables.class'

// Main data model schema
export const tablesSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String()
  },
  { $id: 'Tables', additionalProperties: false }
)
export type Tables = Static<typeof tablesSchema>
export const tablesValidator = getValidator(tablesSchema, dataValidator)
export const tablesResolver = resolve<Tables, HookContext<TablesService>>({})

export const tablesExternalResolver = resolve<Tables, HookContext<TablesService>>({})

// Schema for creating new entries
export const tablesDataSchema = Type.Pick(tablesSchema, ['name'], {
  $id: 'TablesData'
})
export type TablesData = Static<typeof tablesDataSchema>
export const tablesDataValidator = getValidator(tablesDataSchema, dataValidator)
export const tablesDataResolver = resolve<Tables, HookContext<TablesService>>({})

// Schema for updating existing entries
export const tablesPatchSchema = Type.Partial(tablesSchema, {
  $id: 'TablesPatch'
})
export type TablesPatch = Static<typeof tablesPatchSchema>
export const tablesPatchValidator = getValidator(tablesPatchSchema, dataValidator)
export const tablesPatchResolver = resolve<Tables, HookContext<TablesService>>({})

// Schema for allowed query properties
export const tablesQueryProperties = Type.Pick(tablesSchema, ['id', 'name'])
export const tablesQuerySchema = Type.Intersect(
  [
    querySyntax(tablesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type TablesQuery = Static<typeof tablesQuerySchema>
export const tablesQueryValidator = getValidator(tablesQuerySchema, queryValidator)
export const tablesQueryResolver = resolve<TablesQuery, HookContext<TablesService>>({})
