import type { UrlOptions } from '@js-from-routes/core'
import type { VisitOptions } from '@inertiajs/inertia'

export { UrlOptions, VisitOptions }

export type Method =
  | 'get'
  | 'delete'
  | 'post'
  | 'put'
  | 'patch'

type RequestMethod = (url: string, config: VisitOptions) => Promise<any>

/**
 * An Inertia.js form helper.
 */
export interface FormHelper {
  get: RequestMethod
  delete: RequestMethod
  post: RequestMethod
  put: RequestMethod
  patch: RequestMethod
}

/**
 * Options that can be passed to the request method.
 */
export interface RequestOptions extends VisitOptions {
  /**
   * The query string parameters to interpolate in the URL.
   */
  params?: UrlOptions

  /**
   * The body of the request, should be a plain Object or an Inertia.js form.
   */
  data?: any

  /**
   * An Inertia.js form to submit in the request.
   */
  form?: FormHelper
}

export type Options = RequestOptions | UrlOptions

export interface PathHelper {
  <T = any>(options?: Options): Promise<T>
  path: (params?: UrlOptions) => string
  pathTemplate: string
  httpMethod: Method
}
