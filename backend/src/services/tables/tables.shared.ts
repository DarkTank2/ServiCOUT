// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Tables, TablesData, TablesPatch, TablesQuery, TablesService } from './tables.class'

export type { Tables, TablesData, TablesPatch, TablesQuery }

export type TablesClientService = Pick<TablesService<Params<TablesQuery>>, (typeof tablesMethods)[number]>

export const tablesPath = 'tables'

export const tablesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const tablesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(tablesPath, connection.service(tablesPath), {
    methods: tablesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [tablesPath]: TablesClientService
  }
}
