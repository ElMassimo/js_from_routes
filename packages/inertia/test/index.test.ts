import 'isomorphic-fetch'
import { definePathHelper, request, formatUrl } from '../src'

describe('formatUrl', () => {
  it('is exported correctly', () => {
    expect(formatUrl('/users/:id', { id: '5' })).toEqual('/users/5')
  })
})

describe('definePathHelper', () => {
  it('returns a path helper with all the properties', async () => {
    const helper = definePathHelper('get', '/videos/:id/download')

    expect(helper.httpMethod).toEqual('get')
    expect(helper.pathTemplate).toEqual('/videos/:id/download')
    expect(helper.path({ i: 2, id: 5 })).toEqual('/videos/5/download')
  })
})
