// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Flavours, FlavoursData, FlavoursPatch, FlavoursQuery, FlavoursService } from './flavours.class'

export type { Flavours, FlavoursData, FlavoursPatch, FlavoursQuery }

export type FlavoursClientService = Pick<
  FlavoursService<Params<FlavoursQuery>>,
  (typeof flavoursMethods)[number]
>

export const flavoursPath = 'flavours'

export const flavoursMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const flavoursClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(flavoursPath, connection.service(flavoursPath), {
    methods: flavoursMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [flavoursPath]: FlavoursClientService
  }
}
