import type { UrlOptions } from '@js-from-routes/core'
import { formatUrl as coreFormatUrl } from '@js-from-routes/core'
import type { Method, Options, PathHelper } from './types'
import { Config } from './config'

/**
 * Defines a path helper that can make a request or interpolate a URL path.
 *
 * @param {Method} method  An HTTP method
 * @param {string} pathTemplate The path with params placeholders (if any).
 */
function definePathHelper (method: Method, pathTemplate: string): PathHelper {
  const helper = <T = any>(options?: Options) => request(method, pathTemplate, options) as Promise<T>
  helper.path = (options?: UrlOptions) => formatUrl(pathTemplate, options)
  helper.pathTemplate = pathTemplate
  helper.httpMethod = method
  return helper
}

/**
 * Formats a url, replacing segments like /:id/ with the parameter of that name.
 * @param {string} urlTemplate A template URL with placeholders for params
 * @param {Query}  query       Query parameters to append to the URL
 * @param {Params} params      Parameters to interpolateUrl in the URL placeholders
 * @return {string} The interpolated URL with the provided query params (if any)
 * @example
 *   formatUrl('/users/:id', { id: '5' }) returns '/users/5'
 *   formatUrl('/users', { query: { id: '5' } }) returns '/users?id=5'
 */
function formatUrl (urlTemplate: string, options: UrlOptions = {}): string {
  let base = urlTemplate.startsWith('/') ? Config.baseUrl : ''
  if (base.endsWith('/')) base = base.slice(0, base.length - 1)
  return coreFormatUrl(`${base}${urlTemplate}`, options)
}

/**
 * Makes an AJAX request to the API server.
 * @param  {Method}  method HTTP request method
 * @param  {string}  url    May be a template with param placeholders
 * @param  {Options} options Can optionally pass params as a shorthand
 * @return {Promise} The result of the request
 */
async function request (_method: Method, url: string, options: Options = {}): Promise<any> {
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

  const method = (options.method || _method).toUpperCase() as Method
  if (data && (method === 'HEAD' || method === 'GET'))
    throw Object.assign(new Error('Request with GET/HEAD method cannot have data.'), { data })

  url = formatUrl(url, params)

  const requestOptions = {
    method,
    url,
    data: serializeData(data),
    responseAs,
    headers: { ...Config.headers({ method, url, options }), ...headers },
    ...fetchOptions,
  }

  return fetch(Config.modifyRequest(requestOptions) || requestOptions)
    .then(async (response: Response) => await Config.unwrapResponse(response, responseAs))
    .then((data: any) => responseAs === 'json' ? deserializeData(data) : data)
}

export {
  definePathHelper,
  formatUrl,
  request,
}
