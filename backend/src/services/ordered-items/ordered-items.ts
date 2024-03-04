// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import { HookContext, NextFunction } from '../../declarations'

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
import { logger } from '../../logger'

export * from './ordered-items.class'
export * from './ordered-items.schema'

interface OI {
  error?: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
  id: number;
  quantity: number;
  open: number;
  notCashed: number;
  itemId: number;
  orderId: number;
  tenantId: number;
}

async function updateOrder(context: HookContext, next: NextFunction) {
  // if update or patch: check original entry if error and/or open values have changed
  // that would indicate that the stationary preparation is finished and the according order COULD be finished as a whole
  // if the fields had not changed, skip
  // this could be the case if only the cashed field has changed due to (partially) cashing
  // if there was a change, check the whole order if it can be updated to finished = true
  if (Array.isArray(context.data)) {
    await next()
    return
  }
  const { data, params } = context
  const original = await context.app.service('ordered-items').get(context.id, { ...params, query: null })
  if (data.hasOwnProperty('open') && data.open !== original.open) {
    const order = await context.app.service('orders').get(original.orderId, { ...context.params, query: null })
    const orderedItems = await context.app.service('ordered-items').find({ ...context.params, query: { orderId: original.orderId }, paginate: false }) as any as Array<OI>
    // all ordered items for this order except the one to be patched in this call
    const allOtherOrderedItems = orderedItems.filter(({ id }) => id !== original.id)
    const allFinished = allOtherOrderedItems.every(({ open }) => open === 0) && (data.open === 0)
    console.log(allFinished)
    try {
      await next()
      if (allFinished && order.finished !== true) {
        // all are finished but order indicates it is not finished
        await context.app.service('orders').patch(original.orderId, { finished: true })
        // console.log(`Setting order #${order.id} to finished = true`)
      } else if (!allFinished && order.finished !== false) {
        // not all are finished but the order is already indicated to be finished
        await context.app.service('orders').patch(original.orderId, { finished: false })
        // console.log(`Setting order #${order.id} to finished = false`)
      }
    } catch (e) {
      // error occured in saving the incoming data, thus do not change anything
      logger.error(`[AROUND UPDATE/PATH ORDEREDITEMS] ${e.message}`)
      throw e
    }
  } else {
    await next()
  }
}
async function createOrder(context: HookContext, next: NextFunction) {
  // check if open equals zero
  // if so set finished to true for the order
  // this wll happen after the creation of the first ordered-item
  // it does not make any difference if there is only one or several OI for an order, in case of an OI beeing already created in a finished state, it was ordered by a stationary device
  // still check for subsequent OI and maybe even set the order to finished = false if subsequent OI are still open
  const { data } = context
  const order = await context.app.service('orders').get(data.orderId, { ...context.params, query: null })
  // weird typing is necessary since feathers TS does not know when a query has pagination disabled...
  const orderedItems = await context.app.service('ordered-items').find({ ...context.params, query: { orderId: data.orderId }, paginate: false }) as any as Array<OI>
  const allFinished = orderedItems.every(({ open }) => open === 0) && (data.open === 0)
  try {
    await next()
    if (allFinished && order.finished !== true) {
      // all are finished but order indicates it is not finished
      await context.app.service('orders').patch(data.orderId, { finished: true })
      // console.log(`Setting order #${order.id} to finished = true`)
    } else if (!allFinished && order.finished !== false) {
      // not all are finished but the order is already indicated to be finished
      await context.app.service('orders').patch(data.orderId, { finished: false })
      // console.log(`Setting order #${order.id} to finished = false`)
    }
  } catch (e) {
    logger.error(`[AROUND CREATE ORDEREDITEMS] ${e.message}`)
    throw e
  }
}

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
      ],
      create: [createOrder],
      update: [updateOrder],
      patch: [updateOrder]
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
