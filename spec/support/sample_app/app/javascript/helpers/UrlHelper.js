import buildURL from 'axios/lib/helpers/buildURL'
import { deepDecamelizeKeys } from '@helpers/ObjectHelper'
import { snakeCase } from 'lodash'

const INTERPOLATION_PLACEHOLDER = /:[^\W\d]+/g

// Public: Replaces any placeholder in the string with the provided parameters.
function interpolate (template, params) {
  let value = template.toString()
  for (const paramName in params) {
    value = value.replace(`:${snakeCase(paramName)}`, params[paramName])
  }
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
export function formatUrl (urlTemplate, { query, ...params } = {}) {
  const url = interpolate(urlTemplate, params)
  return query ? buildURL(url, deepDecamelizeKeys(query)) : url
}
