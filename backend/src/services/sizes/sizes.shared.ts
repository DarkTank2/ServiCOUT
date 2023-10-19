// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Sizes, SizesData, SizesPatch, SizesQuery, SizesService } from './sizes.class'

export type { Sizes, SizesData, SizesPatch, SizesQuery }

export type SizesClientService = Pick<SizesService<Params<SizesQuery>>, (typeof sizesMethods)[number]>

export const sizesPath = 'sizes'

export const sizesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const sizesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(sizesPath, connection.service(sizesPath), {
    methods: sizesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [sizesPath]: SizesClientService
  }
}
