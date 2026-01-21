// src/feathers.ts
import { createClient } from 'backend'
import { createPiniaClient } from 'feathers-pinia'
import pinia from './stores'
import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'

const host = import.meta.env.VITE_CONNECTION_TARGET || `${window.location.origin}`
const socket = io(host, { transports: ['websocket'] })

export const feathersClient = createClient(socketio(socket), { storage: globalThis.localStorage })

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
