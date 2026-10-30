// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import { Forbidden } from '@feathersjs/errors'
import type { HookContext } from '../declarations'
import type { Roles } from '../client'
import { logger } from '../logger'

export const allowUserRole = (roleNames: Array<String>) => {
  return async (context: HookContext) => {
    let role = context.params.user.role as Roles
    if (!roleNames.includes(role.name)) {
      logger.info(`User "${context.params.user.email}" cannot access ressource "${context.method}/${context.path}" due to missing access-rights!`)
      throw new Forbidden(`Access denied!`)
    }
  }
}
