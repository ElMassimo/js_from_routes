import type { Method } from 'axios'
import type { UrlOptions } from './urls'

import { formatUrl } from './urls'
import { Config } from './config'

export type ResponseAs = 'json' | 'text' | 'response'

export type BaseFetchOptions = Omit<RequestInit, 'method' | 'body'>

export interface FetchOptions extends BaseFetchOptions {
  url: string
  method: Method
  data: any
  responseAs: ResponseAs
  headers: Record<string, string>
}

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
   * The function used to transform the data received from the server.
   * @default camelizeKeys
   */
  deserializeData?: (data: any) => any

  /**
   * Use a different function to make the request.
   * @default Config.fetch
   */
  fetch: (options: FetchOptions) => Promise<Response>

  /**
   * Additional options for the `fetch` function.
   */
  fetchOptions: BaseFetchOptions

  /**
   * The function used to convert the data before sending it to the server.
   * @default snakeCaseKeys
   */
  serializeData?: (data: any) => any

  /**
   * What kind of response is expected. Defaults to `json`. `response` will
   * return the raw response from `fetch`.
   * @default 'json'
   */
  responseAs?: ResponseAs

  /**
   * Headers to send in the request.
   */
  headers?: Record<string, string>
}

export type Options = RequestOptions | UrlOptions

/**
 * Makes an AJAX request to the API server.
 * @param  {Method}  method HTTP request method
 * @param  {string}  url    May be a template with param placeholders
 * @param  {Options} options Can optionally pass params as a shorthand
 * @return {Promise} The result of the request
 */
export async function request (method: Method, url: string, options: Options = {}): Promise<any> {
  method = method.toUpperCase() as Method

  const {
    data,
    deserializeData = Config.deserializeData,
    fetch = Config.fetch,
    fetchOptions,
    headers,
    params = (options.data || options),
    responseAs = 'json',
    serializeData = Config.serializeData,
  } = options

  if (data && (method === 'HEAD' || method === 'GET'))
    throw Object.assign(new Error('Request with GET/HEAD method cannot have data.'), { data })

  const requestOptions = {
    url: formatUrl(url, params),
    method,
    data: serializeData(data),
    responseAs,
    headers: { ...Config.headers({ method, url, options }), ...headers },
    ...fetchOptions,
  }

  return fetch(Config.modifyRequest(requestOptions) || requestOptions)
    .then(async (response: Response) => await Config.unwrapResponse(response, responseAs))
    .then((data: any) => responseAs === 'json' ? deserializeData(data) : data)
}
