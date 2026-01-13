import axios from 'axios'
import type { AxiosRequestConfig, AxiosInstance, ResponseType, AxiosResponse } from 'axios'
import { definePathHelper, formatUrl, request, Config } from '@js-from-routes/client'
import type { ResponseAs, FetchOptions, ResponseError } from '@js-from-routes/client'

/**
 * Allows modifying the Axios instance used to make the requests.
 */
const AxiosConfig = {
  instance: axios as AxiosInstance,
}

/**
 * Unwrap the response based on the `responseAs` value in the request.
 * @returns json, text, or the response.
 */
async function unwrapResponse (response: AxiosResponse, responseAs: ResponseAs) {
  Config.withResponse(response as unknown as Response)
  return responseAs === 'response' ? response : response.data
}

/**
 * Replace the default strategy which uses fetch to use Axios.
 */
async function fetch (args: FetchOptions) {
  const { responseAs, ...options } = args
  const responseType = responseAs === 'response' ? undefined : responseAs.toLowerCase() as ResponseType
  const config = { responseType, ...options }

  return AxiosConfig.instance.request(config as AxiosRequestConfig)
    .catch(error => Config.onResponseError(error as ResponseError))
}

// NOTE: Replace the original `fetch` and `unwrapResponse`.
Object.assign(Config, { fetch, unwrapResponse })

export {
  AxiosConfig,
  Config,
  definePathHelper,
  formatUrl,
  request,
}
