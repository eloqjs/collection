/**
 * Clone an array.
 *
 * @param items
 * @return {[*]}
 */
import { ExtractFunction, ItemData, Key, KeyVariadic, Operator } from './types'

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
 * @param {unknown[]} args
 * @param {number} length
 * @return {*}
 */
export function variadic<T>(
  args: T[] | [T[]],
  length: number = args.length
): T[] {
  if (Array.isArray(args[0]) && args.length === length) {
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

/**
 * Return the default value of the given value.
 *
 * @param {unknown} value
 * @return {unknown}
 */
export function getDefaultValue<V>(value: V | (() => V)): V {
  if (isFunction(value)) {
    return value()
  }

  return value
}

/**
 * Return the value from the given item.
 *
 * @param {Object} item
 * @param {unknown} keyOrCallback
 * @return {unknown}
 */
export function getValueFromItem<Item extends ItemData, K extends KeyVariadic>(
  item: Item,
  keyOrCallback: keyof Item | K | ((item: Item) => unknown)
): unknown

/**
 * Return the value from the given item.
 *
 * @param {Object} item
 * @param {unknown} keyOrCallback
 * @param {number} index
 * @return {unknown}
 */
export function getValueFromItem<Item extends ItemData, K extends KeyVariadic>(
  item: Item,
  keyOrCallback: keyof Item | K | ((item: Item, index: number) => unknown),
  index: number
): unknown

/**
 * Return the value from the given item.
 *
 * @param {Object} item
 * @param {unknown} keyOrCallback
 * @param {number} index
 * @return {unknown}
 */
export function getValueFromItem<Item extends ItemData, K extends KeyVariadic>(
  item: Item,
  keyOrCallback: keyof Item | K | ((item: Item, index?: number) => unknown),
  index?: number
): unknown {
  if (isFunction(keyOrCallback)) {
    return keyOrCallback(item, index)
  }

  return getProp(item, keyOrCallback as K)
}

/**
 * Compare two values using the given operator.
 *
 * @param {[Object, string|string[]]|unknown} value1
 * @param {unknown} value2
 * @param {string} operator
 * @return {boolean}
 */
export function compareValues(
  value1: unknown,
  value2: unknown,
  operator: Operator
): boolean {
  switch (operator) {
    case '==':
      return value1 == value2

    default:
    case '===':
      return value1 === value2

    case '!=':
    case '<>':
      return value1 != value2

    case '!==':
      return value1 !== value2

    case '<':
      return (value1 as never) < (value2 as never)

    case '<=':
      return (value1 as never) <= (value2 as never)

    case '>':
      return (value1 as never) > (value2 as never)

    case '>=':
      return (value1 as never) >= (value2 as never)
  }
}
