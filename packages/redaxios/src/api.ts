import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios'

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
   * @default Config.camelize
   */
  camelize?: KeyConverter
  /**
   * The function used to convert the keys of the data sent to the server.
   * @default Config.decamelize
   */
  decamelize?: KeyConverter

  /**
   * The response type of the request.
   * @default 'json'
   */
  responseType?: ResponseType
}

export interface RequestInfo {
  method: Method
  url: string
  data: any
  params: UrlOptions
}

export type Options = RequestOptions | UrlOptions

/**
 * Makes an AJAX request to the API server.
 * @param  {string}  method HTTP request method
 * @param  {string}  url    May be a template with param placeholders
 * @param  {Options} options Can optionally pass params as a shorthand
 * @return {Promise} The result of the request
 */
export async function request (method: request.Method, url: string, options: Options = {}): Promise<AxiosResponse<any>> {
  return await Config.request(method, url, options)
}

/**
 * Makes an AJAX request to the API server.
 * @param  {Method}  method HTTP request method
 * @param  {string}  url    May be a template with param placeholders
 * @param  {Options} options Can optionally pass params as a shorthand
 * @return {Promise} The result of the request
 */
export async function makeRequest (method: Method, url: string, options: Options = {}): Promise<AxiosResponse<any>> {
  const {
    params = (options.data || options),
    data = {},
    camelize = Config.camelize,
    decamelize = Config.decamelize,
    responseType = 'json',
    ...otherOptions
  } = options

  if (options.data !== undefined && Object.keys(otherOptions).length > 0)
    console.warn(`URL parameters not present in 'data' must be specified explicitly using the 'params' option.\nOptions provided:\n${JSON.stringify(otherOptions)}`)

  const requestOptions = {
    data: decamelize ? deepConvertKeys(data, decamelize) : data,
    method,
    responseType,
    url: formatUrl(url, params),
    headers: Config.headersFor({ method, url, data, params }),
  }

  return Config.fetch(requestOptions)
    .then((response) => {
      // Extract a CSRF token provided in the headers.
      Config.csrfToken = response.headers['x-csrf-token'] || Config.csrfToken

      // If not a JSON request, let the caller handle the conversion.
      if (responseType !== 'json') return response

      return camelize ? deepConvertKeys(response.data, camelize) : response.data
    })
}

/**
 * You may customize these options to tweak the Axios instance and headers.
 */
export const Config = {
  /**
   * The function used to convert the keys of the data received from the server.
   * @default camelCase
   */
  camelize: camelCase,

  /**
   * The function used to convert the keys of the data sent to the server.
   * @default snakeCase
   */
  decamelize: snakeCase,

  /**
   * The CSRF token to use in the requests.
   * @see Config.getCSRFToken
   */
  csrfToken: '',

  /**
   * Strategy to obtain the CSRF token.
   */
  getCSRFToken () {
    return Config.csrfToken || document.querySelector<HTMLMetaElement>('meta[name=csrf-token]')?.content
  },

  /**
   * Returns headers to be sent in the request, JSON is used as the default MIME.
   */
  headersFor (_requestInfo: RequestInfo) {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': Config.getCSRFToken(),
    }
  },

  /**
   * Allows to replace the default strategy which uses an Axios instance.
   */
  async fetch (config: AxiosRequestConfig) {
    const axios = await import('axios')
    return await axios.default.request(config)
  },

  /**
   * Makes an AJAX request to the API server handling serialization and
   * deserialization. You may provide a custom function.
   */
  request: makeRequest,
}
