// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import { disallow } from 'feathers-hooks-common'

import {
  dataLogsDataValidator,
  dataLogsPatchValidator,
  dataLogsQueryValidator,
  dataLogsResolver,
  dataLogsExternalResolver,
  dataLogsDataResolver,
  dataLogsPatchResolver,
  dataLogsQueryResolver
} from './data-logs.schema'

import type { Application } from '../../declarations'
import { DataLogsService, getOptions } from './data-logs.class'
import { dataLogsPath, dataLogsMethods } from './data-logs.shared'

export * from './data-logs.class'
export * from './data-logs.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const dataLogs = (app: Application) => {
  // Register our service on the Feathers application
  app.use(dataLogsPath, new DataLogsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: dataLogsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(dataLogsPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(dataLogsExternalResolver),
        schemaHooks.resolveResult(dataLogsResolver)
      ],
      find: [authenticate('jwt'),],
      get: [authenticate('jwt'),]
    },
    before: {
      all: [
        schemaHooks.validateQuery(dataLogsQueryValidator),
        schemaHooks.resolveQuery(dataLogsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        disallow('external'),
        schemaHooks.validateData(dataLogsDataValidator),
        schemaHooks.resolveData(dataLogsDataResolver)
      ],
      patch: [
        disallow('external'),
        schemaHooks.validateData(dataLogsPatchValidator),
        schemaHooks.resolveData(dataLogsPatchResolver)
      ],
      remove: [disallow('external'),]
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [dataLogsPath]: DataLogsService
  }
}
