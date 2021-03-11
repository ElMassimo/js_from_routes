import { camelCase, snakeCase, deepConvertKeys } from '@js-from-routes/core'

import type { FetchOptions, HeaderOptions, ResponseAs } from './types'

/**
 * You may customize these options to configure how requests are sent.
 */
export const Config = {

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
        return await Config.onError(response, args)
      })
  },

  /**
   * Default headers to be sent in the request, JSON is used as the default MIME.
   */
  headers (_requestInfo: HeaderOptions) {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': Config.getCSRFToken(),
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
  async onError (response: Response, { responseAs }: FetchOptions) {
    let body
    try {
      body = await Config.unwrapResponse(response, responseAs)
      if (body && responseAs === 'json') body = Config.deserializeData(body)
    }
    catch {}
    throw Object.assign(new Error(response.statusText), { response, body })
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
   * Convenience hook to extract headers from the response.
   */
  withResponse (response: Response) {
    // Extract a CSRF token provided in the headers.
    const headers: Record<string, any> = response.headers || {}
    Config.csrfToken = headers['x-csrf-token'] || Config.csrfToken
  },
}
