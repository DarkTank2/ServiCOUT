// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  sizesDataValidator,
  sizesPatchValidator,
  sizesQueryValidator,
  sizesResolver,
  sizesExternalResolver,
  sizesDataResolver,
  sizesPatchResolver,
  sizesQueryResolver
} from './sizes.schema'

import type { Application } from '../../declarations'
import { SizesService, getOptions } from './sizes.class'
import { sizesPath, sizesMethods } from './sizes.shared'

export * from './sizes.class'
export * from './sizes.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const sizes = (app: Application) => {
  // Register our service on the Feathers application
  app.use(sizesPath, new SizesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: sizesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(sizesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(sizesExternalResolver),
        schemaHooks.resolveResult(sizesResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(sizesQueryValidator), schemaHooks.resolveQuery(sizesQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(sizesDataValidator), schemaHooks.resolveData(sizesDataResolver)],
      patch: [schemaHooks.validateData(sizesPatchValidator), schemaHooks.resolveData(sizesPatchResolver)],
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
    [sizesPath]: SizesService
  }
}
