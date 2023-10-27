// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'

describe('ordered-items-have-options service', () => {
  it('registered the service', () => {
    const service = app.service('ordered-items-have-options')

    assert.ok(service, 'Registered the service')
  })
})
