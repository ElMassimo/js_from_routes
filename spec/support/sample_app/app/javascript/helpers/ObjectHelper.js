import { camelCase, isArray, isPlainObject, mapKeys, mapValues, snakeCase } from 'lodash'

function convertKeys (object, keyConverter) {
  if (isPlainObject(object)) {
    return mapKeys(object, (value, key) => keyConverter(key))
  } else {
    return object
  }
}

function deepConvertKeys (object, keyConverter, decamelizer) {
  if (isPlainObject(object)) {
    return mapValues(keyConverter(object, decamelizer), value => deepConvertKeys(value, keyConverter, decamelizer))
  }
  if (isArray(object)) {
    return object.map(item => deepConvertKeys(item, keyConverter, decamelizer))
  }
  return object
}

// Public: Converts all object keys to camelCase, preserving the values.
export function camelizeKeys (object) {
  return convertKeys(object, camelCaseIfNotObjectId)
}

// Public: Converts all object keys to snake_case, preserving the values.
export function decamelizeKeys (object, decamelizer = snakeCase) {
  return convertKeys(object, decamelizer)
}

// Public: Converts all object keys to camelCase, as well as nested objects, or
// objects in nested arrays.
export function deepCamelizeKeys (object) {
  return deepConvertKeys(object, camelizeKeys)
}

// Public: Converts all object keys to snake_case, as well as nested objects, or
// objects in nested arrays.
export function deepDecamelizeKeys (object, decamelizer = snakeCase) {
  return deepConvertKeys(object, decamelizeKeys, decamelizer)
}
