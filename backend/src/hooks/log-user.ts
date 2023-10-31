// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'
import { logger } from '../logger'

export const logUser = async (context: HookContext) => {
  let user = Array.isArray(context.data) ? context.data[0].waiter : context.data.waiter
  logger.info(`[Log-User] ${user || context.params.user.email} on ${context.path}.${context.method}`)
}
