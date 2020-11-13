/**
 * Clone an array.
 *
 * @param items
 * @returns {[*]}
 */
export function clone(items: unknown[]): unknown[] {
  return [...items]
}

/**
 * Get value of a nested property.
 *
 * @param holder
 * @param {string} key
 * @returns {*}
 */
export function nestedValue(
  holder: Record<string, unknown>,
  key: string | string[]
): unknown {
  if (!key || !holder) {
    return holder
  }

  if (key === 'string' && key in holder) {
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
 * @returns {*}
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
 * @returns {boolean}
 */
export function isArray(item: unknown): item is Array<any> {
  return Array.isArray(item)
}

/**
 * The isObject() method determines whether the passed value is an Object.
 *
 * @param {*} item
 * @returns {boolean}
 */
export function isObject(item: unknown): item is Record<string, any> {
  return (
    typeof item === 'object' && Array.isArray(item) === false && item !== null
  )
}

/**
 * The isFunction() method determines whether the passed value is a Function.
 *
 * @param {*} item
 * @returns {boolean}
 */
export function isFunction(item: unknown): item is (...args: any[]) => any {
  return typeof item === 'function'
}

/**
 * The isString() method determines whether the passed value is a String.
 */
export function isString(item: unknown): item is string {
  return typeof item === 'string'
}
