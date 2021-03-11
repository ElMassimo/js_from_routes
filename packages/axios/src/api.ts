/* eslint-disable prefer-const */
/* eslint-disable import/no-mutable-exports */
import axios from 'axios'
import type { AxiosResponse, Method } from 'axios'

import { camelCase, csrfToken, snakeCase, formatUrl, deepConvertKeys } from '@js-from-routes/core'
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

/**
 * Makes an AJAX request to the API server.
 * @param  {Method}  method HTTP request method
 * @param  {string}  url    May be a template with param placeholders
 * @param  {RequestOptions|UrlOptions} options Can optionally pass params as a shorthand
 * @return {Promise} The result of the request
 */
export async function makeRequest (method: Method, url: string, options: RequestOptions | UrlOptions = {}): Promise<AxiosResponse<any>> {
  const { params = (options.data || options), data = {}, camelize = camelCase, decamelize = snakeCase, responseType = 'json', ...otherOptions } = options

  const requestOptions = {
    data: decamelize ? deepConvertKeys(data, decamelize) : data,
    method,
    responseType,
    url: formatUrl(url, params),
    headers: {
      ...defaultRequestHeaders,
      'X-CSRF-TOKEN': csrfToken(defaultRequestHeaders['X-CSRF-TOKEN']),
    },
  }

  return axiosInstance.request(requestOptions)
    .then((response) => {
      // Extract a CSRF token provided in the headers.
      const csrfToken = response.headers['x-csrf-token']
      if (csrfToken) defaultRequestHeaders['X-CSRF-TOKEN'] = csrfToken

      // If not a JSON request, let the caller handle the conversion.
      if (responseType !== 'json') return response

      return camelize ? deepConvertKeys(response.data, camelize) : response.data
    })
}

/**
 * Makes an AJAX request to the API server.
 * @param  {Method}  method HTTP request method
 * @param  {string}  url    May be a template with param placeholders
 * @param  {RequestOptions|UrlOptions} options Can optionally pass params as a shorthand
 * @return {Promise} The result of the request
 */
export let request = makeRequest

/**
 * Allows to easily add interceptors to the Axios instance used to make requests.
 * NOTE: You may replace this mutable reference with a different Axios instance.
 */
export let axiosInstance = axios.create()

/**
 * Default options for the requests, JSON is used as the default MIME type.
 * NOTE: You may replace this mutable reference to changethe default headers.
 */
export let defaultRequestHeaders: Record<string, string> = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}
