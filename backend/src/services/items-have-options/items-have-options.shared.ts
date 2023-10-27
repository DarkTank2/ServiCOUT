// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  ItemsHaveOptions,
  ItemsHaveOptionsData,
  ItemsHaveOptionsPatch,
  ItemsHaveOptionsQuery,
  ItemsHaveOptionsService
} from './items-have-options.class'

export type { ItemsHaveOptions, ItemsHaveOptionsData, ItemsHaveOptionsPatch, ItemsHaveOptionsQuery }

export type ItemsHaveOptionsClientService = Pick<
  ItemsHaveOptionsService<Params<ItemsHaveOptionsQuery>>,
  (typeof itemsHaveOptionsMethods)[number]
>

export const itemsHaveOptionsPath = 'items-have-options'

export const itemsHaveOptionsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const itemsHaveOptionsClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(itemsHaveOptionsPath, connection.service(itemsHaveOptionsPath), {
    methods: itemsHaveOptionsMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [itemsHaveOptionsPath]: ItemsHaveOptionsClientService
  }
}
