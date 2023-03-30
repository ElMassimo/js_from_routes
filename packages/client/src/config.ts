import { camelCase, snakeCase, deepConvertKeys } from '@js-from-routes/core'

import type { FetchOptions, HeaderOptions, ResponseAs } from './types'

export interface ResponseError extends Error {
  body?: any
  response?: Response
}

/**
 * You may customize these options to configure how requests are sent.
 */
export const Config = {
  /**
   * An optional base URL when the API is hosted on a different domain.
   */
  baseUrl: '',

  /**
   * The function used to transform the data received from the server.
   * @default camelizeKeys
   */
  deserializeData: (data: any) => deepConvertKeys(data, camelCase),

  /**
   * The function used to convert the data before sending it to the server.
   * @default snakeCaseKeys
   */
  serializeData: (data: any) => deepConvertKeys(data, snakeCase),

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
   * Allows to replace the default strategy to use Axios or other libraries.
   */
  async fetch (args: FetchOptions): Promise<Response> {
    const { url, data, responseAs, ...options } = args

    const requestInit: RequestInit = {
      body: data === undefined ? data : JSON.stringify(data),
      credentials: 'include',
      redirect: 'follow',
      ...options,
    }

    return fetch(url, requestInit)
      .then(async (response) => {
        if (response.status >= 200 && response.status < 300) return response
        throw await Config.unwrapResponseError(response, responseAs)
      })
      .catch(Config.onResponseError)
  },

  /**
   * Default headers to be sent in the request, JSON is used as the default MIME.
   */
  headers (_requestInfo: HeaderOptions) {
    const csrfToken = Config.getCSRFToken()
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    }
  },

  /**
   * Allows changes to the request data before it is sent to the server.
   */
  modifyRequest (request: FetchOptions): FetchOptions | undefined {
    return request
  },

  /**
   * Allows to intercept errors globally.
   */
  async onResponseError (error: ResponseError) {
    throw error
  },

  /**
   * Unwrap the response based on the `responseAs` value in the request.
   * @returns json, text, or the response.
   */
  async unwrapResponse (response: Response, responseAs: ResponseAs) {
    Config.withResponse(response)

    if (responseAs === 'response')
      return response

    if (response.status === 204)
      return null

    return await response[responseAs]().catch(() => null)
  },

  /**
   * Similar to unwrapResponse, but when a request fails.
   */
  async unwrapResponseError (response: Response, responseAs: ResponseAs) {
    const error = new Error(response.statusText) as ResponseError
    error.response = response
    try {
      const body = await Config.unwrapResponse(response, responseAs)
      error.body = responseAs === 'json' ? Config.deserializeData(body) : body
    }
    catch {}
    return error
  },

  /**
   * Convenience hook to extract headers from the response.
   */
  withResponse (response: Response) {
    // Extract a CSRF token provided in the headers.
    const headers = response.headers || {}
    Config.csrfToken = headers.get('x-csrf-token') || Config.csrfToken
  },
}
