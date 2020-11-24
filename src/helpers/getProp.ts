import type { KeyVariadic } from '../../types'
import clone from './clone'
import { isArray, isObject, isString } from './is'

/**
 * Get property defined by dot notation in string.
 *
 * Based on {@link https://github.com/dy/dotprop} (MIT)
 *
 * @param  {Object} holder - Target object where to look property up.
 * @param  {string | string[]} key - Dot notation, like `'a.b.c'` or `['a', 'b', 'c']`.
 * @return {*} - A property value.
 */
function getProp(holder: Record<string, unknown>, key: KeyVariadic): unknown {
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

export default getProp
