// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  orderedItemsDataValidator,
  orderedItemsPatchValidator,
  orderedItemsQueryValidator,
  orderedItemsResolver,
  orderedItemsExternalResolver,
  orderedItemsDataResolver,
  orderedItemsPatchResolver,
  orderedItemsQueryResolver
} from './ordered-items.schema'

import type { Application } from '../../declarations'
import { OrderedItemsService, getOptions } from './ordered-items.class'
import { orderedItemsPath, orderedItemsMethods } from './ordered-items.shared'
import { logUser } from '../../hooks/log-user'

export * from './ordered-items.class'
export * from './ordered-items.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const orderedItems = (app: Application) => {
  // Register our service on the Feathers application
  app.use(orderedItemsPath, new OrderedItemsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: orderedItemsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(orderedItemsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(orderedItemsExternalResolver),
        schemaHooks.resolveResult(orderedItemsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(orderedItemsQueryValidator),
        schemaHooks.resolveQuery(orderedItemsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        logUser,
        schemaHooks.validateData(orderedItemsDataValidator),
        schemaHooks.resolveData(orderedItemsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(orderedItemsPatchValidator),
        schemaHooks.resolveData(orderedItemsPatchResolver)
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
    [orderedItemsPath]: OrderedItemsService
  }
}
