import { deepConvertKeys, forEach, isURLSearchParams, isDate, isObject, snakeCase } from './utils'

export type Query = Record<string, any>
export type Params = Record<string, any>

export type UrlOptions = {
  query?: Query
  [key: string]: any
}

const REQUIRED_PARAMETER = /:[^\W\d]+/g
const OPTIONAL_PARAMETER = /\(\/:[^\W\d]+\)/g

// Internal: Encodes a value to be used as an URL query parameter.
function encode (val: any): string {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

/**
 * Serializes the provided parameters as an URL query string.
 */
function serializeQuery (params: Query): string {
  const parts: string[] = []

  forEach(params, (val, key) => {
    if (val === null || typeof val === 'undefined')
      return

    if (Array.isArray(val))
      key = `${key}[]`
    else
      val = [val]

    forEach(val, (v) => {
      if (isDate(v))
        v = v.toISOString()
      else if (isObject(v))
        v = JSON.stringify(v)

      parts.push(`${encode(key)}=${encode(v)}`)
    })
  })

  return parts.join('&')
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {Params} params The params to be appended
 * @returns {string} The formatted url
 */
function buildURL (url: string, params: Query | undefined): string {
  if (!params) return url

  const queryStr = isURLSearchParams(params)
    ? params.toString()
    : serializeQuery(deepConvertKeys(params, snakeCase))

  if (queryStr) {
    const hashmarkIndex = url.indexOf('#')
    if (hashmarkIndex !== -1)
      url = url.slice(0, hashmarkIndex)

    url += `${url.includes('?') ? '&' : '?'}${queryStr}`
  }

  return url
}

/**
 * Replaces any placeholder in the string with the provided parameters.
 *
 * @param  {string} template The URL template with `:placeholders`
 * @param  {Params} params   Parameters to inject in the placeholders
 * @return {string} The resulting URL with replaced placeholders
 */
export function interpolate (template: string, params: Params): string {
  let value = template.toString()
  Object.entries(params).forEach(([paramName, paramValue]) => {
    value = value.replace(`((/?):${snakeCase(paramName)})`, `/$2${paramValue}`)
  })
  // Remove any optional path if the parameters were not provided.
  value = value.replace(OPTIONAL_PARAMETER, '')

  const missingParams = value.match(REQUIRED_PARAMETER)
  if (missingParams) {
    const missing = missingParams.join(', ')
    const provided = params && Object.keys(params).join(', ')
    throw new TypeError(`Missing ${missing} for ${template}. Params provided: ${provided}`)
  }
  return value
}

// Public: Formats a url, replacing segments like /:id/ with the parameter of
// that name.
//
// Example:
//   formatUrl('/users/:id', { id: '5' }) returns '/users/5'
//   formatUrl('/users', { query: { id: '5' } }) returns '/users?id=5'
export function formatUrl (urlTemplate: string, { query, ...params }: UrlOptions = {}): string {
  return buildURL(interpolate(urlTemplate, params), query)
}
