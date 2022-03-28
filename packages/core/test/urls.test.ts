import { describe, it, expect } from 'vitest'
import { interpolateUrl, formatUrl } from '../src'

describe('interpolateUrl', () => {
  it('replaces parameters correctly', () => {
    expect(interpolateUrl('/video_clips/:video_clip_id/comments/:id', { video: '5', videoClipId: '5', id: '3' }))
      .toEqual('/video_clips/5/comments/3')
  })

  it('replaces duplicate parameters', () => {
    expect(interpolateUrl('/video_clips/:id/comments/:id', { video: '5', videoClipId: '5', id: '3' }))
      .toEqual('/video_clips/3/comments/3')
  })

  it('fails when there are missing parameters', () => {
    expect(() => interpolateUrl('/video_clips/:video_clip_id/comments/:id', { video: '5', videoClipId: '5' }))
      .toThrow(/Missing URL Parameter :id/)

    expect(() => interpolateUrl('/video_clips/:video_clip_id/comments/:id', { id: '5' }))
      .toThrow(/Params provided: id/)
  })

  it('deals with optional parameters', () => {
    expect(interpolateUrl('(/:locale)/users/:id', { loc: '9000', locale: 'en', id: '5' }))
      .toEqual('/en/users/5')

    expect(interpolateUrl('(/:locale)/users/:id', { id: '5', loc: '9000' }))
      .toEqual('/users/5')

    expect(interpolateUrl('/users/:id(/:page)', { id: '5' }))
      .toEqual('/users/5')
  })
})

describe('formatUrl', () => {
  it('replaces parameters correctly', () => {
    expect(formatUrl('/users/:id', { id: '5' })).toEqual('/users/5')
  })

  it('uses snake case for url parameters', () => {
    expect(formatUrl('/video_clip/:video_clip_id', { videoClipId: '1' })).toEqual('/video_clip/1')
  })

  it('adds query parameters when it has to', () => {
    expect(formatUrl('/users/:id', { query: { singleParam: '2' }, id: '1' }))
      .toEqual('/users/1?single_param=2')

    expect(formatUrl('/users/:id', { query: { multiParam: ['2', '3'] }, id: '1' }))
      .toEqual('/users/1?multi_param[]=2&multi_param[]=3')

    const objectParam = { a: '2', b: '3' }
    const objectQueryUrl = formatUrl('/users/:id', { query: { objectParam }, id: '1' })
    expect(objectQueryUrl)
      .toEqual('/users/1?object_param=%7B%22a%22:%222%22,%22b%22:%223%22%7D')

    const url = new URL(objectQueryUrl, 'http://example.com')
    expect(url.searchParams.get('object_param')).toEqual(JSON.stringify(objectParam))
  })
})
