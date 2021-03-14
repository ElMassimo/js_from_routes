import { Inertia } from '@inertiajs/inertia'

import { formatUrl } from '@js-from-routes/core'
import { FormHelper, Method, Options, PathHelper, VisitOptions, UrlOptions } from './types'

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
 * Returns true if the object is an Inertia.js form helper.
 */
function isFormHelper (val: any, method: Method): val is FormHelper {
  // eslint-disable-next-line no-prototype-builtins
  return val?.hasOwnProperty('data') && val[method]
}

/**
 * Makes an AJAX request to the API server.
 * @param  {Method}  method HTTP request method
 * @param  {string}  url    May be a template with param placeholders
 * @param  {Options} options Can optionally pass params as a shorthand
 * @return {Promise} The result of the request
 */
async function request (_method: Method, url: string, options: Options = {}): Promise<any> {
  const { params = (options.data || options), data, form = data, ...otherOptions } = options

  const config = params === options ? {} : otherOptions as VisitOptions

  const method = (options.method || _method).toLowerCase() as Method
  url = formatUrl(url, params)

  if (isFormHelper(form, method)) return form[method](url, config)

  const safeData = method === 'delete' ? undefined : data || {}
  return Inertia.visit(url, { preserveState: true, data: safeData, ...config })
}

export {
  definePathHelper,
  formatUrl,
  request,
}
