export type KeyConverter = (key: string) => string

export type Dictionary = Record<string, any>

const toString = Object.prototype.toString

/**
 * Escapes the specified string to be safely injected in a Regexp expression.
 */
export function escapeRegExp (val: string) {
  return val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
export function isURLSearchParams (val: any): val is URLSearchParams {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
export function isDate (val: unknown): val is Date {
  return toString.call(val) === '[object Date]'
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
export function isString (val: unknown): val is string {
  return typeof val === 'string'
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
export function isPlainObject (val: unknown): val is Dictionary {
  if (toString.call(val) !== '[object Object]')
    return false

  const prototype = Object.getPrototypeOf(val)
  return prototype === null || prototype === Object.prototype
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
export function isObject (val: unknown): val is object {
  return val !== null && typeof val === 'object'
}

/**
 * Creates an object with the same values as `object` and keys generated by
 * running each property of `object` through `converter`.
 * The converter is invoked with two arguments: (value, key).
 *
 * @param {Object} object The object to iterate over.
 * @param {Function} converter The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 */
export function mapKeys (object: Dictionary, converter: (value: any, key: string) => any): Dictionary {
  return Object.entries(object).reduce<Dictionary>((result, entry) => {
    const [key, value] = entry
    if (isString(key)) result[converter(value, key)] = value
    return result
  }, {})
}

/**
 * Creates an object with the same keys as `object` and values generated
 * by running each property of `object` through `converter`.
 * The converter is invoked with two arguments: (value, key).
 *
 * @param {Object} object The object to iterate over.
 * @param {Function} converter The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 */
export function mapValues (object: Dictionary, converter: (value: any, key?: string) => any): Dictionary {
  return Object.entries(object).reduce<Dictionary>((result, entry) => {
    const [key, value] = entry
    result[key] = converter(value, key)
    return result
  }, {})
}

/**
 * Returns the camelCased version of a snake_cased string.
 * @example camelCase('build_output_dir') === 'buildOutputDir'
 */
export function camelCase (key: string) {
  return key.replace(/([-_][a-z])/ig, $1 => $1.toUpperCase().replace('-', '').replace('_', ''))
}

/**
 * Returns the snake_cased version of a camelCased string.
 * @example snakeCase('buildOutputDir') === 'build_output_dir'
 */
export function snakeCase (key: string) {
  return key.replace(/([a-z\d])([A-Z])/g, '$1_$2').toLowerCase()
}

/**
 * Returns a new object with converted key names, if `object` is a plain object.
 */
export function convertKeys<T> (object: T, keyConverter: KeyConverter): T | Dictionary {
  if (isPlainObject(object))
    return mapKeys(object as unknown as object, (_value, key) => keyConverter(key))
  else
    return object
}

/**
 * Recursively converts all keys in nested objects.
 *
 * @params {Object|Array} object The value to recursively scan
 * @params {Function} keyConverter A function to transform the keys
 */
export function deepConvertKeys<T> (object: T, keyConverter: KeyConverter): T | Dictionary {
  if (Array.isArray(object))
    return object.map(item => deepConvertKeys(item, keyConverter))

  if (isPlainObject(object))
    return mapValues(convertKeys(object, keyConverter), value => deepConvertKeys(value, keyConverter))

  return object
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
export function forEach (obj: any, fn: (value: any, keyOrIndex: any, obj: Dictionary | any[]) => void) {
  if (obj === null || typeof obj === 'undefined')
    return

  if (!isObject(obj))
    obj = [obj] // Force an array if not already something iterable

  if (Array.isArray(obj)) {
    for (let i = 0, l = obj.length; i < l; i++)
      fn(obj[i], i, obj)
  }
  else {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key))
        fn(obj[key], key, obj)
    }
  }
}
