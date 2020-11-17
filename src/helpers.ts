/**
 * Clone an array.
 *
 * @param items
 * @return {[*]}
 */
import { ExtractFunction, Key, KeyVariadic } from './types'

export function clone<T extends unknown[]>(items: T): T {
  return [...items] as T
}

/**
 * Get property defined by dot notation in string.
 *
 * Based on {@link https://github.com/dy/dotprop} (MIT)
 *
 * @param  {Object} holder - Target object where to look property up.
 * @param  {string | string[]} key - Dot notation, like `'a.b.c'` or `['a', 'b', 'c']`.
 * @return {*} - A property value.
 */
export function getProp(
  holder: Record<string, unknown>,
  key: KeyVariadic
): unknown {
  if (!key) {
    return holder
  }

  if (isString(key) && key in holder) {
    return holder[key]
  }

  const propParts = Array.isArray(key) ? clone(key) : (key + '').split('.')

  let result: unknown = holder

  while (propParts.length && result) {
    const propPart = propParts.shift()

    if ((isObject(result) || isArray(result)) && propPart) {
      result = result[propPart]
    }
  }

  return result
}

/**
 * Variadic helper function.
 *
 * @param args
 * @return {*}
 */
export function variadic<T>(args: T[] | [T[]]): T[] {
  if (Array.isArray(args[0])) {
    return args[0]
  }

  return args as T[]
}

/**
 * The isArray() method determines whether the passed value is an Array.
 *
 * @param {*} item
 * @return {boolean}
 */
export function isArray(item: unknown): item is Array<unknown> {
  return Array.isArray(item)
}

/**
 * The isObject() method determines whether the passed value is an Object.
 *
 * @param {*} item
 * @return {boolean}
 */
export function isObject(item: unknown): item is Record<string, unknown> {
  return (
    typeof item === 'object' && Array.isArray(item) === false && item !== null
  )
}

/**
 * The isFunction() method determines whether the passed value is a Function.
 *
 * @param {*} item
 * @return {boolean}
 */
export function isFunction<T>(item: T): item is ExtractFunction<T> {
  return typeof item === 'function'
}

/**
 * The isString() method determines whether the passed value is a String.
 *
 * @param {*} item
 * @return {boolean}
 */
export function isString(item: unknown): item is string {
  return typeof item === 'string'
}

/**
 * The isNumber() method determines whether the passed value is a Number.
 *
 * @param {*} item
 * @return {boolean}
 */
export function isNumber(item: unknown): item is number {
  return typeof item === 'number'
}

/**
 * Build key path map.
 *
 * @param {Object} items
 * @return {[]|Object}
 */
export function buildKeyPathMap(
  items: Record<string, unknown>[]
): unknown[] | Record<string, unknown> {
  const keyPaths = {}

  items.forEach((item, index) => {
    function buildKeyPath(val: unknown, keyPath: string | number) {
      if (isObject(val)) {
        Object.keys(val).forEach((prop) => {
          buildKeyPath(val[prop], `${keyPath}.${prop}`)
        })
      } else if (isArray(val)) {
        val.forEach((v, i) => {
          buildKeyPath(v, `${keyPath}.${i}`)
        })
      }

      keyPaths[keyPath] = val
    }

    buildKeyPath(item, index)
  })

  return keyPaths
}

/**
 * Match key path map.
 *
 * @param {string} key
 * @param {[]|Object} pathMap
 * @return {[]}
 */
export function matches(
  key: Key,
  pathMap: unknown[] | Record<string, unknown>
): unknown[] {
  const matches: unknown[] = []
  const regex = new RegExp(`0.${key}`, 'g')
  const numberOfLevels = `0.${key}`.split('.').length

  Object.keys(pathMap).forEach((k) => {
    const matchingKey = k.match(regex)

    if (matchingKey) {
      const match = matchingKey[0]

      if (match.split('.').length === numberOfLevels) {
        matches.push(pathMap[match])
      }
    }
  })

  return matches
}
