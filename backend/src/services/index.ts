import { roles } from './roles/roles'
import { orderedItems } from './ordered-items/ordered-items'
import { itemsHaveOptions } from './items-have-options/items-have-options'
import { tenant } from './tenants/tenants'
import { orderedItemHasOption } from './ordered-items-have-options/ordered-items-have-options'
import { option } from './options/options'
import { tables } from './tables/tables'
import { categories } from './categories/categories'
import { items } from './items/items'
import { flavours } from './flavours/flavours'
import { sizes } from './sizes/sizes'
import { baseItems } from './base-items/base-items'
import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(roles)
  app.configure(orderedItems)
  app.configure(itemsHaveOptions)
  app.configure(tenant)
  app.configure(orderedItemHasOption)
  app.configure(option)
  app.configure(tables)
  app.configure(categories)
  app.configure(items)
  app.configure(flavours)
  app.configure(sizes)
  app.configure(baseItems)
  app.configure(user)
  // All services will be registered here
}
