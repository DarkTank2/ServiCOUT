// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  OrderedItems,
  OrderedItemsData,
  OrderedItemsPatch,
  OrderedItemsQuery,
  OrderedItemsService
} from './ordered-items.class'

export type { OrderedItems, OrderedItemsData, OrderedItemsPatch, OrderedItemsQuery }

export type OrderedItemsClientService = Pick<
  OrderedItemsService<Params<OrderedItemsQuery>>,
  (typeof orderedItemsMethods)[number]
>

export const orderedItemsPath = 'ordered-items'

export const orderedItemsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const orderedItemsClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(orderedItemsPath, connection.service(orderedItemsPath), {
    methods: orderedItemsMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [orderedItemsPath]: OrderedItemsClientService
  }
}
