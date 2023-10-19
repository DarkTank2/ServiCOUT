// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  BaseItems,
  BaseItemsData,
  BaseItemsPatch,
  BaseItemsQuery,
  BaseItemsService
} from './base-items.class'

export type { BaseItems, BaseItemsData, BaseItemsPatch, BaseItemsQuery }

export type BaseItemsClientService = Pick<
  BaseItemsService<Params<BaseItemsQuery>>,
  (typeof baseItemsMethods)[number]
>

export const baseItemsPath = 'base-items'

export const baseItemsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const baseItemsClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(baseItemsPath, connection.service(baseItemsPath), {
    methods: baseItemsMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [baseItemsPath]: BaseItemsClientService
  }
}
