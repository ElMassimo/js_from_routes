import { formatUrl } from '@js-from-routes/core'
import type { Method, Options } from './types'
import { Config } from './config'

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
