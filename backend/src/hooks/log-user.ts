// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'
import { logger } from '../logger'

export const logUser = async (context: HookContext) => {
  let waiter = Array.isArray(context.data) ? context.data[0].waiter : context.data.waiter
  let message = `[Log-User] ${waiter || context.params.user.email} on ${context.path}.${context.method}`
  if (context.type === 'after') {
    message += ` | ${context.path}.id = ${context.result.id}`
  }
  logger.info(message)
}
