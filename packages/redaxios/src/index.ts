import redaxios, { Options, Response as RedaxiosResponse } from 'redaxios'
import { definePathHelper, formatUrl, request, Config } from '@js-from-routes/client'
import type { ResponseAs, FetchOptions, ResponseError } from '@js-from-routes/client'

/**
 * Unwrap the response based on the `responseAs` value in the request.
 * @returns json, text, or the response.
 */
async function unwrapResponse (response: RedaxiosResponse<any>, responseAs: ResponseAs) {
  Config.withResponse(response as unknown as Response)
  return responseAs === 'response' ? response : response.data
}

/**
 * Replace the default strategy which uses fetch to use Axios.
 */
async function fetch (args: FetchOptions) {
  const { url, method, responseAs, ...options } = args
  const config: Options = {
    method: method as Options['method'],
    responseType: responseAs.toLowerCase() as Options['responseType'],
    ...options,
  }
  return redaxios.request(url, config)
    .catch(error => Config.onResponseError(error as ResponseError))
}

// NOTE: Replace the original `fetch` and `unwrapResponse`.
Object.assign(Config, { fetch, unwrapResponse })

export {
  Config,
  definePathHelper,
  formatUrl,
  request,
}
