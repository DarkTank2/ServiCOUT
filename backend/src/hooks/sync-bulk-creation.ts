// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const syncBulkCreation = async (context: HookContext) => {
  if (Array.isArray(context.data)) {
    let now = (new Date()).toISOString()
    context.data.forEach(data => {
      data.createdAt = now
      data.updatedAt = now
    })
  }
}
