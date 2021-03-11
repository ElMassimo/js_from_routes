import { camelCase, Dictionary, isArray, isPlainObject, mapKeys, mapValues, snakeCase } from 'lodash'

type KeyConverter = (key: string) => string

function convertKeys<T> (object: T, keyConverter: KeyConverter): T | Dictionary<any> {
  if (isPlainObject(object))
    return mapKeys(object as unknown as object, (_value, key) => keyConverter(key))
  else
    return object
}

function deepConvertKeys<T> (object: T, keyConverter: KeyConverter): T | Dictionary<any> {
  if (isPlainObject(object))
    return mapValues(convertKeys(object, keyConverter), (value: any) => deepConvertKeys(value, keyConverter))

  if (isArray(object))
    return object.map(item => deepConvertKeys(item, keyConverter))

  return object
}

// Public: Converts all object keys to camelCase, preserving the values.
export function camelizeKeys<T> (object: T) {
  return convertKeys(object, camelCase)
}

// Public: Converts all object keys to snake_case, preserving the values.
export function decamelizeKeys<T> (object: T) {
  return convertKeys(object, snakeCase)
}

// Public: Converts all object keys to camelCase, as well as nested objects, or
// objects in nested arrays.
export function deepCamelizeKeys<T> (object: T) {
  return deepConvertKeys(object, camelCase)
}

// Public: Converts all object keys to snake_case, as well as nested objects, or
// objects in nested arrays.
export function deepDecamelizeKeys<T> (object: T) {
  return deepConvertKeys(object, snakeCase)
}
