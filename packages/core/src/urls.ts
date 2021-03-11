import buildURL from 'axios/lib/helpers/buildURL'
import { deepConvertKeys, snakeCase } from './utils'

const REQUIRED_PARAMETER = /:[^\W\d]+/g
const OPTIONAL_PARAMETER = /\(\/:[^\W\d]+\)/g

export type Query = Record<string, any>
export type Params = Record<string, any>
export type UrlOptions = {
  query?: Query
  [key: string]: any
}

// Public: Replaces any placeholder in the string with the provided parameters.
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
  const url = interpolate(urlTemplate, params)
  return query ? buildURL(url, deepConvertKeys(query, snakeCase)) : url
}
