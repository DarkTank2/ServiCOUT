// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  itemsHaveOptionsDataValidator,
  itemsHaveOptionsPatchValidator,
  itemsHaveOptionsQueryValidator,
  itemsHaveOptionsResolver,
  itemsHaveOptionsExternalResolver,
  itemsHaveOptionsDataResolver,
  itemsHaveOptionsPatchResolver,
  itemsHaveOptionsQueryResolver
} from './items-have-options.schema'

import type { Application } from '../../declarations'
import { ItemsHaveOptionsService, getOptions } from './items-have-options.class'
import { itemsHaveOptionsPath, itemsHaveOptionsMethods } from './items-have-options.shared'

export * from './items-have-options.class'
export * from './items-have-options.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const itemsHaveOptions = (app: Application) => {
  // Register our service on the Feathers application
  app.use(itemsHaveOptionsPath, new ItemsHaveOptionsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: itemsHaveOptionsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(itemsHaveOptionsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(itemsHaveOptionsExternalResolver),
        schemaHooks.resolveResult(itemsHaveOptionsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(itemsHaveOptionsQueryValidator),
        schemaHooks.resolveQuery(itemsHaveOptionsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(itemsHaveOptionsDataValidator),
        schemaHooks.resolveData(itemsHaveOptionsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(itemsHaveOptionsPatchValidator),
        schemaHooks.resolveData(itemsHaveOptionsPatchResolver)
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
    [itemsHaveOptionsPath]: ItemsHaveOptionsService
  }
}
