// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  DataLogs,
  DataLogsData,
  DataLogsPatch,
  DataLogsQuery,
  DataLogsService
} from './data-logs.class'

export type { DataLogs, DataLogsData, DataLogsPatch, DataLogsQuery }

export type DataLogsClientService = Pick<
  DataLogsService<Params<DataLogsQuery>>,
  (typeof dataLogsMethods)[number]
>

export const dataLogsPath = 'data-logs'

export const dataLogsMethods: Array<keyof DataLogsService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove'
]

export const dataLogsClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(dataLogsPath, connection.service(dataLogsPath), {
    methods: dataLogsMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [dataLogsPath]: DataLogsClientService
  }
}
