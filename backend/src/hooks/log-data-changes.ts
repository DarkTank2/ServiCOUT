import type { HookContext, NextFunction, ServiceTypes } from '../declarations'
import { Value } from '@sinclair/typebox/value'
import { logger } from '../logger'
import { Id } from '@feathersjs/feathers'
type Method = 'find' | 'get' | 'create' | 'update' | 'patch' | 'remove'

export const logDataChanges = () => {
    return async (context: HookContext, next: NextFunction) => {
        if (!context.params.user) {
            throw new Error('User not authenticated')
        }
        if (context.path === 'authentication') {
            throw new Error('Cannot log changes for authentication service')
        }
        let originalData: { data?: any[] } = { data: [{}] }
        let ids: Id[] = []
        if (context.id) {
            ids = [context.id]
        } else if (context.method !== 'create') {
            ids = Array.isArray(context.data) ? context.data.map((item: any) => item.id as Id) : [context.data.id as Id]
        }
        if (['patch', 'update', 'remove'].includes(context.method)) {
            originalData = await context.app.service(context.path).find({ query: { id: { $in: ids } } }, context)
        }
        
        await next()

        let results = Array.isArray(context.result) ? context.result : [context.result]
        let diffs = []
        results.forEach((result, index) => {
            let diff = Value.Diff({ ...originalData.data[index] }, context.method === 'remove' ? {} : result)
            diffs.push(diff)
        })
        for (let i in diffs) {
            let diff = diffs[i]
            let logEntry = {
                service: context.path as keyof ServiceTypes,
                method: context.method as Method,
                entityId: results[i].id as number,
                diff: JSON.stringify(diff),
                userId: context.params.user.id,
                tenantId: originalData.data[i]?.tenantId || results[i]?.tenantId || 1
            }
            await context.app.service('data-logs').create(logEntry)
        }
    }
}