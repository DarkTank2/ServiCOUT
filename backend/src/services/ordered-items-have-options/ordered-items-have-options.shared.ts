// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  OrderedItemHasOption,
  OrderedItemHasOptionData,
  OrderedItemHasOptionPatch,
  OrderedItemHasOptionQuery,
  OrderedItemHasOptionService
} from './ordered-items-have-options.class'

export type {
  OrderedItemHasOption,
  OrderedItemHasOptionData,
  OrderedItemHasOptionPatch,
  OrderedItemHasOptionQuery
}

export type OrderedItemHasOptionClientService = Pick<
  OrderedItemHasOptionService<Params<OrderedItemHasOptionQuery>>,
  (typeof orderedItemHasOptionMethods)[number]
>

export const orderedItemHasOptionPath = 'ordered-items-have-options'

export const orderedItemHasOptionMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const orderedItemHasOptionClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(orderedItemHasOptionPath, connection.service(orderedItemHasOptionPath), {
    methods: orderedItemHasOptionMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [orderedItemHasOptionPath]: OrderedItemHasOptionClientService
  }
}
