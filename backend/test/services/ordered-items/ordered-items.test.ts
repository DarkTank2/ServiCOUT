// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'

describe('ordered-items service', () => {
  it('registered the service', () => {
    const service = app.service('ordered-items')

    assert.ok(service, 'Registered the service')
  })
})
