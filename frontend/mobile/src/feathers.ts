// src/feathers.ts
import { createClient } from 'backend'
import { createPiniaClient } from 'feathers-pinia'
import pinia from './store/index'
import rest from '@feathersjs/rest-client'

const host = import.meta.env.VITE_MY_API_URL as string || 'http://localhost:3030'
const fetch = window.fetch.bind(window)

export const feathersClient = createClient(rest(host).fetch(fetch), { storage: window.localStorage })

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
    setupInstance(data) {
      return data
    },
    customizeStore(defaultStore) {
      return {}
    },
    services: {
        sizes: {},
        flavours: {},
        items: {},
        'base-items': {}
    },
  })
