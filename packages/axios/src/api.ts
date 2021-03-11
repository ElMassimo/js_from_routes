/* eslint-disable prefer-const */
/* eslint-disable import/no-mutable-exports */
import axios from 'axios'
import type { Method } from 'axios'

import { camelCase, snakeCase, formatUrl, deepConvertKeys } from '@js-from-routes/core'
import type { KeyConverter, UrlOptions } from '@js-from-routes/core'

export interface RequestOptions {
  /**
   * The query string parameters to interpolate in the URL.
   */
  params?: UrlOptions
  /**
   * The body of the request, should be a plain Object.
   */
  data?: any
  /**
   * The function used to convert the keys of the data received from the server.
   * @default camelCase
   */
  camelize?: KeyConverter
  /**
   * The function used to convert the keys of the data sent to the server.
   * @default snakeCase
   */
  decamelize?: KeyConverter

  /**
   * The response type of the request.
   * @default 'json'
   */
  responseType?: ResponseType
}

// Public: Makes an AJAX request to the Rails server.
//
// method - One of 'get', 'post', 'path', 'put', 'delete'.
// url - The url of the request.
// options - Can be the "params" as a shorthand, or an Object with options.
//
// Returns a Promise for the request.
export async function makeRequest (method: Method, url: string, options: RequestOptions | UrlOptions = {}) {
  const { params = (options.data || options), data = {}, camelize = camelCase, decamelize = snakeCase, responseType = 'json', ...otherOptions } = options

  const requestOptions = {
    data: decamelize ? deepConvertKeys(data, decamelize) : data,
    method,
    responseType,
    url: formatUrl(url, params),
    headers: {
      ...defaultRequestHeaders,
      'X-CSRF-TOKEN': csrfToken() || '',
    },
  }

  return axiosApi.request(requestOptions)
    .then((response) => {
      if (responseType !== 'json') return response // Let the caller handle the conversion.
      return camelize ? deepConvertKeys(response.data, camelize) : response.data
    })
}

// NOTE: Allows to target only API requests with the interceptors.
export let request = makeRequest

// NOTE: Allows to easily add interceptors, or replace the axios object.
export let axiosApi = axios.create()

// Default options for the requests, JSON is used as the default MIME type.
// NOTE: Allows the user to replace or modify the default headers.
export let defaultRequestHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}
