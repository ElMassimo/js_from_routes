import axios from 'axios'
import { formatUrl } from '~/helpers/UrlHelper'
import { snakeCase } from 'lodash'
import { deepCamelizeKeys, deepDecamelizeKeys } from '~/helpers/ObjectHelper'

// Public: Makes an AJAX request to the Rails server.
//
// method - One of 'get', 'post', 'path', 'put', 'delete'.
// url - The url of the request.
// options - Can be the "params" as a shorthand, or an Object with the following:
//   params: The query string parameters to interpolate in the URL.
//   data: The body of the request, should be a plain Object.
//   camelize: Whether to camelize the keys of the data obtained from the server.
//   decamelize: The function used to snakeCase the keys of the data sent to the server.
//
// Returns a Promise for the request.
export function request (method, url, options = {}) {
  const { params = (options.data || options), data = {}, camelize = true, decamelize = snakeCase } = options

  const decamelizedData = decamelize ? deepDecamelizeKeys(data, decamelize) : data

  const requestOptions = {
    data: decamelizedData,
    method,
    url: formatUrl(url, params),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }

  return axios.request(requestOptions)
    .then(response => {
      return camelize ? deepCamelizeKeys(response.data) : response.data
    })
}
