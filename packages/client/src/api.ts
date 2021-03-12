import type { UrlOptions } from '@js-from-routes/core'
import { formatUrl } from '@js-from-routes/core'
import type { Method, Options } from './types'
import { Config } from './config'

/**
 * Uses the path from the specified named helper, interpolating parameters or
 * appending a query string, if provided.
 * @param {string}     name    The name of the endpoint
 * @param {UrlOptions} options Parameters to interpolate in the url, or query parameters
 */
export function pathFor (this: any, name: string, options: UrlOptions): string {
  if (!this) throw new Error(`Called pathFor helper on a detached function. Make sure to use YourRequests.pathFor('${name}') instead.`)
  const requestFn = this[name]
  if (!requestFn) throw new Error(`Unknown path helper ${name} for ${JSON.stringify(this)}`)
  return requestFn({ ...options, pathOnly: true })
}

/**
 * Makes an AJAX request to the API server.
 * @param  {Method}  method HTTP request method
 * @param  {string}  url    May be a template with param placeholders
 * @param  {Options} options Can optionally pass params as a shorthand
 * @return {Promise} The result of the request
 */
export async function request (method: Method, url: string, options: Options & { pathOnly?: boolean } = {}): Promise<any> {
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

  url = formatUrl(url, params)
  if (options.pathOnly) return url

  method = method.toUpperCase() as Method
  if (data && (method === 'HEAD' || method === 'GET'))
    throw Object.assign(new Error('Request with GET/HEAD method cannot have data.'), { data })

  const requestOptions = {
    url,
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
