// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Items, ItemsData, ItemsPatch, ItemsQuery, ItemsService } from './items.class'

export type { Items, ItemsData, ItemsPatch, ItemsQuery }

export type ItemsClientService = Pick<ItemsService<Params<ItemsQuery>>, (typeof itemsMethods)[number]>

export const itemsPath = 'items'

export const itemsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const itemsClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(itemsPath, connection.service(itemsPath), {
    methods: itemsMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [itemsPath]: ItemsClientService
  }
}
