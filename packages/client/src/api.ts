import type { UrlOptions } from '@js-from-routes/core'
import { formatUrl } from '@js-from-routes/core'
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
