// src/feathers.ts
import { createClient } from 'backend'
import type { OrderedItemHasOption } from 'backend'
import { createPiniaClient } from 'feathers-pinia'
import pinia from './store/index'
import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'

const host = import.meta.env.VITE_MY_API_URL as string || 'http://localhost:3030'
const socket = io(host, { transports: ['websocket'] })

export const feathersClient = createClient(socketio(socket), { storage: window.localStorage })

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
    services: {},
  })
