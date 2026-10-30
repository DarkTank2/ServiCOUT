// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  optionDataValidator,
  optionPatchValidator,
  optionQueryValidator,
  optionResolver,
  optionExternalResolver,
  optionDataResolver,
  optionPatchResolver,
  optionQueryResolver
} from './options.schema'

import type { Application } from '../../declarations'
import { OptionService, getOptions } from './options.class'
import { optionPath, optionMethods } from './options.shared'
import { allowUserRole, logDataChanges } from '../../hooks'

export * from './options.class'
export * from './options.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const option = (app: Application) => {
  // Register our service on the Feathers application
  app.use(optionPath, new OptionService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: optionMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(optionPath).hooks({
    around: {
      all: [
        // authenticate('jwt'),
        schemaHooks.resolveExternal(optionExternalResolver),
        schemaHooks.resolveResult(optionResolver)
      ],
      create: [authenticate('jwt'), logDataChanges()],
      patch: [authenticate('jwt'), logDataChanges()],
      remove: [authenticate('jwt'), logDataChanges()]
    },
    before: {
      all: [
        schemaHooks.validateQuery(optionQueryValidator),
        schemaHooks.resolveQuery(optionQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        allowUserRole(['admin']),
        schemaHooks.validateData(optionDataValidator),
        schemaHooks.resolveData(optionDataResolver)
      ],
      patch: [
        allowUserRole(['admin']),
        schemaHooks.validateData(optionPatchValidator),
        schemaHooks.resolveData(optionPatchResolver)
      ],
      remove: [
        allowUserRole(['admin']),
      ]
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
  let publishMatrix = app.get('publishMatrix')
    publishMatrix[optionPath] = 3
    app.set('publishMatrix', publishMatrix)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [optionPath]: OptionService
  }
}
