// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  tablesDataValidator,
  tablesPatchValidator,
  tablesQueryValidator,
  tablesResolver,
  tablesExternalResolver,
  tablesDataResolver,
  tablesPatchResolver,
  tablesQueryResolver
} from './tables.schema'

import type { Application } from '../../declarations'
import { TablesService, getOptions } from './tables.class'
import { tablesPath, tablesMethods } from './tables.shared'
import { allowUserRole } from '../../hooks/allow-user-role'

export * from './tables.class'
export * from './tables.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const tables = (app: Application) => {
  // Register our service on the Feathers application
  app.use(tablesPath, new TablesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: tablesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(tablesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(tablesExternalResolver),
        schemaHooks.resolveResult(tablesResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(tablesQueryValidator),
        schemaHooks.resolveQuery(tablesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        allowUserRole(['admin']),
        schemaHooks.validateData(tablesDataValidator),
        schemaHooks.resolveData(tablesDataResolver)
      ],
      patch: [
        allowUserRole(['admin']),
        schemaHooks.validateData(tablesPatchValidator),
        schemaHooks.resolveData(tablesPatchResolver)
      ],
      remove: [
        allowUserRole(['admin'])
      ]
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
    [tablesPath]: TablesService
  }
}
