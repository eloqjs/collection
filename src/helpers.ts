/**
 * Clone an array.
 *
 * @param items
 * @return {[*]}
 */
export function clone(items: unknown[]): unknown[] {
  return [...items]
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
  key: string | string[]
): unknown {
  if (!key || !holder) {
    return holder
  }

  if (isString(key) && key in holder) {
    return holder[key]
  }

  const propParts = Array.isArray(key) ? key : (key + '').split('.')

  let result: unknown = holder

  while (propParts.length && result) {
    const propPart = propParts.shift()

    if (isObject(result) && propPart) {
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
export function isFunction(
  item: unknown
): item is (...args: unknown[]) => unknown {
  return typeof item === 'function'
}

/**
 * The isString() method determines whether the passed value is a String.
 */
export function isString(item: unknown): item is string {
  return typeof item === 'string'
}
