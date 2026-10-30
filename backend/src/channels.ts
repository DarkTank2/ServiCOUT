// For more information about this file see https://dove.feathersjs.com/guides/cli/channels.html
import type { RealTimeConnection, Params } from '@feathersjs/feathers'
import type { AuthenticationResult } from '@feathersjs/authentication'
import '@feathersjs/transport-commons'
import type { Application, HookContext } from './declarations'
import { logger } from './logger'
import { Roles, Tenant } from './client'

export const channels = (app: Application) => {
  logger.warn(
    'Publishing all events to all authenticated users. See `channels.ts` and https://dove.feathersjs.com/api/channels.html for more information.'
  )

  app.on('connection', (connection: RealTimeConnection) => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection)
  })

  app.on('login', (authResult: AuthenticationResult, { connection }: Params) => {
    console.log(JSON.stringify(authResult))// connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if (!connection) return
    
    const { user: { role: { name: roleName }, tenant: { name: tenantName } } } = authResult
    // The connection is no longer anonymous, remove it
    app.channel('anonymous').leave(connection)

    // Add it to the authenticated user channel
    app.channel(generateChannelName(roleName, tenantName)).join(connection)
    
  })

  // eslint-disable-next-line no-unused-vars
  app.publish(async (data: any, context: HookContext) => {
    let publishMatrix = app.get('publishMatrix')
    let publishRole = publishMatrix[context.path]
    const allRoles = await context.app.service('roles').find({ query: {}, paginate: false })
    let rawChannels: Array<{ tenant: Tenant, roles: Array<Roles> }> = []
    const { tenantId } = data
    if (!tenantId) {
      // data not tenant-specific, publish to all tenants and to all user-roles
      let tenants = await context.app.service('tenants').find({
        query: {}, paginate: false
      })
      tenants.forEach(tenant => rawChannels.push({ tenant, roles: allRoles }))
    } else {
      // tenant specific data, publish to this tenant and all parent-tenants
      //  for this tenant publish to all defined roles
      // for parent-tenants publish only to admin-roles
      let tenant = await context.app.service('tenants').get(tenantId)
      let parentTenants = await getAllParentTenants(tenant, context)
      rawChannels.push({ tenant, roles: allRoles.filter(role => role.id <= (publishRole || 1)) })
      parentTenants.forEach(tenant => rawChannels.push({ tenant, roles: allRoles.filter(({ id }) => id === 1) }))
    }
    logger.debug(`Publishing data for service "${context.path}" and method "${context.method}" to following channels:`)
    const channels = rawChannels.flatMap(({ tenant, roles }) => roles.map(role => generateChannelName(role.name, tenant.name)))
    logger.debug(JSON.stringify(channels))
    // e.g. to publish all service events to all authenticated users use
    return app.channel(channels)
  })
}

const generateChannelName = (roleName: string, tenantName: string) => {
  return `${roleName}|${tenantName.replace(/\s/g, '_')}`
}
const getAllParentTenants = async (tenant: Tenant, context: HookContext): Promise<Tenant[]> => {
  if (tenant.parentId) {
    const parentTenant = await context.app.service('tenants').get(tenant.parentId)
    return [parentTenant, ...(await getAllParentTenants(parentTenant, context))]
  }
  return []
}
