import 'isomorphic-fetch'
import { definePathHelper, request, formatUrl } from '../src'

describe('formatUrl', () => {
  it('is exported correctly', () => {
    expect(formatUrl('/users/:id', { id: '5' })).toEqual('/users/5')
  })
})

describe('request', () => {
  it.only('can unwrap a JSON response', async () => {
    expect(await request('get', 'https://pokeapi.co/api/v2/pokemon/:pokemon', { pokemon: 'pikachu' })).toMatchObject({
      name: 'pikachu',
    })
  })

  it('can return the raw response', async () => {
    const fakeFetch = async (...args: any[]) => ({ status: 200, body: args })
    expect(await request('get', '/videos/:id/download', { id: 2, fetch: fakeFetch, responseAs: 'response' })).toEqual({
      status: 200,
      body: [{
        method: 'GET',
        responseAs: 'response',
        url: '/videos/2/download',
        data: undefined,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-Token': undefined,
        },
      }],
    })
  })
})

describe('definePathHelper', () => {
  it('returns a path helper with all the properties', async () => {
    const helper = definePathHelper('get', '/videos/:id/download')

    expect(helper.httpMethod).toEqual('get')
    expect(helper.pathTemplate).toEqual('/videos/:id/download')
    expect(helper.path({ i: 2, id: 5 })).toEqual('/videos/5/download')

    const fakeFetch = async (...args: any[]) => ({ status: 200, json: () => Promise.all(args) })
    expect(await helper({ id: 2, fetch: fakeFetch })).toEqual([{
      data: undefined,
      headers: {
        Accept: 'application/json',
        ContentType: 'application/json',
        XCSRFToken: undefined,
      },
      method: 'GET',
      responseAs: 'json',
      url: '/videos/2/download',
    }])
  })
})
