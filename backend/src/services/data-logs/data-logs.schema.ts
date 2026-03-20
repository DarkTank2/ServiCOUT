// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { DataLogsService } from './data-logs.class'

// Main data model schema
export const dataLogsSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'DataLogs', additionalProperties: false }
)
export type DataLogs = Static<typeof dataLogsSchema>
export const dataLogsValidator = getValidator(dataLogsSchema, dataValidator)
export const dataLogsResolver = resolve<DataLogsQuery, HookContext<DataLogsService>>({})

export const dataLogsExternalResolver = resolve<DataLogs, HookContext<DataLogsService>>({})

// Schema for creating new entries
export const dataLogsDataSchema = Type.Pick(dataLogsSchema, ['text'], {
  $id: 'DataLogsData'
})
export type DataLogsData = Static<typeof dataLogsDataSchema>
export const dataLogsDataValidator = getValidator(dataLogsDataSchema, dataValidator)
export const dataLogsDataResolver = resolve<DataLogsData, HookContext<DataLogsService>>({})

// Schema for updating existing entries
export const dataLogsPatchSchema = Type.Partial(dataLogsSchema, {
  $id: 'DataLogsPatch'
})
export type DataLogsPatch = Static<typeof dataLogsPatchSchema>
export const dataLogsPatchValidator = getValidator(dataLogsPatchSchema, dataValidator)
export const dataLogsPatchResolver = resolve<DataLogsPatch, HookContext<DataLogsService>>(
  {}
)

// Schema for allowed query properties
export const dataLogsQueryProperties = Type.Pick(dataLogsSchema, ['id', 'text'])
export const dataLogsQuerySchema = Type.Intersect(
  [
    querySyntax(dataLogsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type DataLogsQuery = Static<typeof dataLogsQuerySchema>
export const dataLogsQueryValidator = getValidator(dataLogsQuerySchema, queryValidator)
export const dataLogsQueryResolver = resolve<DataLogsQuery, HookContext<DataLogsService>>(
  {}
)
