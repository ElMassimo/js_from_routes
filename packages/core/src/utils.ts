/* eslint-disable prefer-const */
/* eslint-disable import/no-mutable-exports */
export type KeyConverter = (key: string) => string

export type Dictionary = Record<string, any>

export function mapKeys (value: Dictionary, converter: KeyConverter): Dictionary {
  return Object.entries(value).reduce<Dictionary>((result, entry) => {
    const [key, value] = entry
    result[converter(key)] = value
    return result
  }, {})
}

export function mapValues (value: Dictionary, converter: (value: any) => any): Dictionary {
  return Object.entries(value).reduce<Dictionary>((result, entry) => {
    const [key, value] = entry
    result[key] = converter(value)
    return result
  }, {})
}

// Internal: Returns true if the specified value is a plain JS object
function _isPlainObject (value: unknown): value is Dictionary {
  return Object.prototype.toString.call(value) === '[object Object]'
}

// Internal: Returns the camelCased version of a snake_cased string.
// Example: _camelCase('build_output_dir') === 'buildOutputDir'
function _camelCase (key: string) {
  return key.replace(/([-_][a-z])/ig, $1 => $1.toUpperCase().replace('-', '').replace('_', ''))
}

// Internal: Returns the snake_cased version of a camelCased string.
// Example: _snakeCase('buildOutputDir') === 'build_output_dir'
function _snakeCase (key: string) {
  return key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
}

// Public: Returns a new object with converted key names.
export function convertKeys<T> (object: T, keyConverter: KeyConverter): T | Dictionary {
  if (isPlainObject(object))
    return mapKeys(object as unknown as object, key => keyConverter(key))
  else
    return object
}

// Public: Recursively converts all keys in nested objects.
export function deepConvertKeys<T> (object: T, keyConverter: KeyConverter): T | Dictionary {
  if (Array.isArray(object))
    return object.map(item => deepConvertKeys(item, keyConverter))

  if (isPlainObject(object))
    return mapValues(convertKeys(object, keyConverter), value => deepConvertKeys(value, keyConverter))

  return object
}

// NOTE: Allow a user to replace it with lodash or similar.
export let camelCase = _camelCase
export let snakeCase = _snakeCase
export let isPlainObject = _isPlainObject
