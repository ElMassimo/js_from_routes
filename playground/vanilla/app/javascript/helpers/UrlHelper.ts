import buildURL from 'axios/lib/helpers/buildURL'
import { snakeCase } from 'lodash'
import { deepDecamelizeKeys } from '~/helpers/ObjectHelper'

const INTERPOLATION_PLACEHOLDER = /:[^\W\d]+/g

type Query = Record<string, any>
type Params = Record<string, any>
type UrlOptions = {
  query?: Query
  [key: string]: any
}

// Public: Replaces any placeholder in the string with the provided parameters.
function interpolate (template: string, params: Params): string {
  let value = template.toString()
  Object.entries(params).forEach(([paramName, paramValue]) => {
    value = value.replace(`:${snakeCase(paramName)}`, paramValue)
  })
  const missingParams = value.match(INTERPOLATION_PLACEHOLDER)
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
  return query ? buildURL(url, deepDecamelizeKeys(query)) : url
}
