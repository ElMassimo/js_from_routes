import type { UrlOptions } from '@js-from-routes/core'

export type Method =
  | 'GET' | 'get'
  | 'DELETE' | 'delete'
  | 'HEAD' | 'head'
  | 'OPTIONS' | 'options'
  | 'POST' | 'post'
  | 'PUT' | 'put'
  | 'PATCH' | 'patch'
  | 'PURGE' | 'purge'
  | 'LINK' | 'link'
  | 'UNLINK' | 'unlink'

export type ResponseAs = 'response' | 'json' | 'text' | 'blob' | 'formData' | 'arrayBuffer'

/**
 * Options for `fetch` that can be customized.
 */
export type BaseFetchOptions = Omit<RequestInit, 'method' | 'body'>

/**
 * Passed to the `fetch` function when performing a request.
 */
export interface FetchOptions extends BaseFetchOptions {
  url: string
  method: Method
  data: any
  responseAs: ResponseAs
  headers: Record<string, string>
}

/**
 *
 */
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
   * Override the default method for the path helper.
   */
  method: Method

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

export interface HeaderOptions {
  method: Method
  url: string
  options: Options
}

export interface PathHelper {
  <T = any>(options?: Options): Promise<T>
  path: (params?: UrlOptions) => string
  pathTemplate: string
  httpMethod: Method
}
