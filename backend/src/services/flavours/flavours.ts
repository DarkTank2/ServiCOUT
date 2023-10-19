// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  flavoursDataValidator,
  flavoursPatchValidator,
  flavoursQueryValidator,
  flavoursResolver,
  flavoursExternalResolver,
  flavoursDataResolver,
  flavoursPatchResolver,
  flavoursQueryResolver
} from './flavours.schema'

import type { Application } from '../../declarations'
import { FlavoursService, getOptions } from './flavours.class'
import { flavoursPath, flavoursMethods } from './flavours.shared'

export * from './flavours.class'
export * from './flavours.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const flavours = (app: Application) => {
  // Register our service on the Feathers application
  app.use(flavoursPath, new FlavoursService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: flavoursMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(flavoursPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(flavoursExternalResolver),
        schemaHooks.resolveResult(flavoursResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(flavoursQueryValidator),
        schemaHooks.resolveQuery(flavoursQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(flavoursDataValidator),
        schemaHooks.resolveData(flavoursDataResolver)
      ],
      patch: [
        schemaHooks.validateData(flavoursPatchValidator),
        schemaHooks.resolveData(flavoursPatchResolver)
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
    [flavoursPath]: FlavoursService
  }
}
