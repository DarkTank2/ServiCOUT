// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  orderedItemHasOptionDataValidator,
  orderedItemHasOptionPatchValidator,
  orderedItemHasOptionQueryValidator,
  orderedItemHasOptionResolver,
  orderedItemHasOptionExternalResolver,
  orderedItemHasOptionDataResolver,
  orderedItemHasOptionPatchResolver,
  orderedItemHasOptionQueryResolver
} from './ordered-items-have-options.schema'

import type { Application } from '../../declarations'
import { OrderedItemHasOptionService, getOptions } from './ordered-items-have-options.class'
import { orderedItemHasOptionPath, orderedItemHasOptionMethods } from './ordered-items-have-options.shared'

export * from './ordered-items-have-options.class'
export * from './ordered-items-have-options.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const orderedItemHasOption = (app: Application) => {
  // Register our service on the Feathers application
  app.use(orderedItemHasOptionPath, new OrderedItemHasOptionService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: orderedItemHasOptionMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(orderedItemHasOptionPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(orderedItemHasOptionExternalResolver),
        schemaHooks.resolveResult(orderedItemHasOptionResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(orderedItemHasOptionQueryValidator),
        schemaHooks.resolveQuery(orderedItemHasOptionQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(orderedItemHasOptionDataValidator),
        schemaHooks.resolveData(orderedItemHasOptionDataResolver)
      ],
      patch: [
        schemaHooks.validateData(orderedItemHasOptionPatchValidator),
        schemaHooks.resolveData(orderedItemHasOptionPatchResolver)
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
    [orderedItemHasOptionPath]: OrderedItemHasOptionService
  }
}
