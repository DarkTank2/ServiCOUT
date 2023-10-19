// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  baseItemsDataValidator,
  baseItemsPatchValidator,
  baseItemsQueryValidator,
  baseItemsResolver,
  baseItemsExternalResolver,
  baseItemsDataResolver,
  baseItemsPatchResolver,
  baseItemsQueryResolver
} from './base-items.schema'

import type { Application } from '../../declarations'
import { BaseItemsService, getOptions } from './base-items.class'
import { baseItemsPath, baseItemsMethods } from './base-items.shared'

export * from './base-items.class'
export * from './base-items.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const baseItems = (app: Application) => {
  // Register our service on the Feathers application
  app.use(baseItemsPath, new BaseItemsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: baseItemsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(baseItemsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(baseItemsExternalResolver),
        schemaHooks.resolveResult(baseItemsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(baseItemsQueryValidator),
        schemaHooks.resolveQuery(baseItemsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(baseItemsDataValidator),
        schemaHooks.resolveData(baseItemsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(baseItemsPatchValidator),
        schemaHooks.resolveData(baseItemsPatchResolver)
      ],
      remove: []
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
    [baseItemsPath]: BaseItemsService
  }
}
