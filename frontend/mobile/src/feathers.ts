// src/feathers.ts
import { createClient } from 'backend'
// import { createPiniaClient } from 'feathers-pinia'
import pinia from './stores/index'
import rest from '@feathersjs/rest-client'

const host = import.meta.env.VITE_MY_API_URL as string || 'http://localhost:3030'
const fetch = globalThis.fetch.bind(globalThis)

export const feathersClient = createClient(rest(host).fetch(fetch), { storage: globalThis.localStorage })

export const api = createPiniaClient(feathersClient, {
    pinia,
    idField: 'id',
    // optional
    ssr: false,
    whitelist: [],
    paramsForServer: [],
    skipGetIfExists: true,
    customSiftOperators: {},
    syncWithStorage: true,
    setupInstance(data: any) {
      return data
    },
    customizeStore(_defaultStore: any) {
      return {}
    },
    services: {},
  })
