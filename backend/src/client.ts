// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { tablesClient } from './services/tables/tables.shared'
export type { Tables, TablesData, TablesQuery, TablesPatch } from './services/tables/tables.shared'

import { categoriesClient } from './services/categories/categories.shared'
export type {
  Categories,
  CategoriesData,
  CategoriesQuery,
  CategoriesPatch
} from './services/categories/categories.shared'

import { itemsClient } from './services/items/items.shared'
export type { Items, ItemsData, ItemsQuery, ItemsPatch } from './services/items/items.shared'

import { flavoursClient } from './services/flavours/flavours.shared'
export type {
  Flavours,
  FlavoursData,
  FlavoursQuery,
  FlavoursPatch
} from './services/flavours/flavours.shared'

import { sizesClient } from './services/sizes/sizes.shared'
export type { Sizes, SizesData, SizesQuery, SizesPatch } from './services/sizes/sizes.shared'

import { baseItemsClient } from './services/base-items/base-items.shared'
export type {
  BaseItems,
  BaseItemsData,
  BaseItemsQuery,
  BaseItemsPatch
} from './services/base-items/base-items.shared'

import { userClient } from './services/users/users.shared'
export type { User, UserData, UserQuery, UserPatch } from './services/users/users.shared'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the backend app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any,>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(userClient)
  client.configure(baseItemsClient)
  client.configure(sizesClient)
  client.configure(flavoursClient)
  client.configure(itemsClient)
  client.configure(categoriesClient)
  client.configure(tablesClient)
  return client
}
