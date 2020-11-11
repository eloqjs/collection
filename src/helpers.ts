/**
 * Clone helper
 *
 * Clone an array.
 *
 * @param items
 * @returns {*}
 */
export function clone(items: unknown[]): unknown[] {
  return [...items]
}

/**
 * Get value of a nested property.
 *
 * @param mainObject
 * @param {string} key
 * @returns {*}
 */
export function nestedValue(mainObject: unknown, key: string): any {
  if (isObject(mainObject)) {
    return key.split('.').reduce((obj, property) => {
      return obj[property]
    }, mainObject)
  }

  // If we end up here, we're not working with an object, and @var mainObject is the value itself
  return mainObject
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
