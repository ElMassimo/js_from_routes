// JsFromRoutes CacheKey 804cc0e27771c7968938ccf7cfa2cf82
//
// DO NOT MODIFY: This file was automatically generated by JsFromRoutes.
import { formatUrl } from '~/helpers/UrlHelper'
import { request } from '~/services/ApiService'

export default {
  downloadPath: options =>
    formatUrl('/video_clips/:id/download', options),

  addToPlaylist: options =>
    request('patch', '/video_clips/:id/add_to_playlist', options),

  removeFromPlaylist: options =>
    request('patch', '/video_clips/:id/remove_from_playlist', options),

  trending: options =>
    request('get', '/video_clips/trending', options),

  thumbnail: options =>
    request('get', '/video_clips/:id/thumbnail/:thumbnail_id', options),

  create: options =>
    request('post', '/video_clips', options),

  new: options =>
    request('get', '/video_clips/new', options),

  edit: options =>
    request('get', '/video_clips/:id/edit', options),

  update: options =>
    request('patch', '/video_clips/:id', options),

  destroy: options =>
    request('delete', '/video_clips/:id', options),
}