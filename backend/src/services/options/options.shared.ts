// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Option, OptionData, OptionPatch, OptionQuery, OptionService } from './options.class'

export type { Option, OptionData, OptionPatch, OptionQuery }

export type OptionClientService = Pick<OptionService<Params<OptionQuery>>, (typeof optionMethods)[number]>

export const optionPath = 'options'

export const optionMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const optionClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(optionPath, connection.service(optionPath), {
    methods: optionMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [optionPath]: OptionClientService
  }
}
