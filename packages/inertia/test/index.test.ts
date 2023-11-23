import { describe, it, expect, vi, afterEach } from 'vitest'
import { Inertia } from '@inertiajs/inertia'
import { definePathHelper, formatUrl } from '../src'
import { Config } from '../src/config'

vi.mock('@inertiajs/inertia', () => ({
  Inertia: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

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

describe('request', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('serializes data before sending the request', () => {
    it('POST', () => {
      const helper = definePathHelper('post', '/videos/:id/download')

      helper({ data: { id: 5, camelKey: 'test' } })

      expect(Inertia.post).toHaveBeenCalledWith(
        '/videos/5/download',
        { camel_key: 'test', id: 5 },
        { data: { camelKey: 'test', id: 5 } },
      )
    })

    it('DELETE', () => {
      const helper = definePathHelper('delete', '/videos/:id/download')

      helper({ params: { id: 5 }, data: { camelKey: 'test' } })

      expect(Inertia.delete).toHaveBeenCalledWith('/videos/5/download', {
        data: { camel_key: 'test' },
        params: { id: 5 },
      })
    })

    describe('as a form helper', () => {
      it('snake cases keys', () => {
        const helper = definePathHelper('post', '/videos/:id/download')
        const form = {
          transform: vi.fn(),
          post: vi.fn(),
          data: { camelKey: 'test' },
        }

        helper({ params: { id: 5 }, form })

        expect(form.post).toHaveBeenCalledWith('/videos/5/download', {})
        expect(form.transform).toHaveBeenCalledWith(Config.serializeData)
      })

      it('allows to pass in a custom serializer', () => {
        const helper = definePathHelper('post', '/videos/:id/download')
        const form = {
          transform: vi.fn(),
          post: vi.fn(),
          data: { camelKey: 'test' },
        }
        const serializeData = () => ({ camel_key: 'test' })

        helper({ params: { id: 5 }, form, serializeData })

        expect(form.post).toHaveBeenCalledWith('/videos/5/download', {})
        expect(form.transform).toHaveBeenCalledWith(serializeData)
      })
    })
  })
})
