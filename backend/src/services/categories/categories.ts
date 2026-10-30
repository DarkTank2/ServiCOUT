// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  categoriesDataValidator,
  categoriesPatchValidator,
  categoriesQueryValidator,
  categoriesResolver,
  categoriesExternalResolver,
  categoriesDataResolver,
  categoriesPatchResolver,
  categoriesQueryResolver
} from './categories.schema'

import type { Application, HookContext } from '../../declarations'
import { CategoriesService, getOptions } from './categories.class'
import { categoriesPath, categoriesMethods } from './categories.shared'
import { allowUserRole, denyUserRole, logDataChanges } from '../../hooks'

export * from './categories.class'
export * from './categories.schema'

const addCategoryFilter = async function (context: HookContext) {
  if (!context.params.user?.role || context.params.user.role.name === 'user') {
    context.params.query = {
      ...context.params.query,
      shippedToUsers: true
    }
  }
}

// A configure function that registers the service and its hooks via `app.configure`
export const categories = (app: Application) => {
  // Register our service on the Feathers application
  app.use(categoriesPath, new CategoriesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: categoriesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(categoriesPath).hooks({
    around: {
      all: [
        // authenticate('jwt'),
        schemaHooks.resolveExternal(categoriesExternalResolver),
        schemaHooks.resolveResult(categoriesResolver)
      ],
      create: [authenticate('jwt'), logDataChanges()],
      patch: [authenticate('jwt'), logDataChanges()],
      remove: [authenticate('jwt'), logDataChanges()]
    },
    before: {
      all: [
        schemaHooks.validateQuery(categoriesQueryValidator),
        schemaHooks.resolveQuery(categoriesQueryResolver)
      ],
      find: [addCategoryFilter],
      get: [addCategoryFilter],
      create: [
        allowUserRole(['admin']),
        schemaHooks.validateData(categoriesDataValidator),
        schemaHooks.resolveData(categoriesDataResolver)
      ],
      patch: [
        denyUserRole(['user']),
        schemaHooks.validateData(categoriesPatchValidator),
        schemaHooks.resolveData(categoriesPatchResolver)
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
  let publishMatrix = app.get('publishMatrix')
  publishMatrix[categoriesPath] = 3
  app.set('publishMatrix', publishMatrix)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [categoriesPath]: CategoriesService
  }
}
