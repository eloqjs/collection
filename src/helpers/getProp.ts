import type { Key, KeyVariadic } from '../types'
import clone from './clone'
import { isArray, isObject, isString } from './is'

/**
 * Get property parts.
 *
 * @param {Object} holder - Target object where to look property up.
 * @param {string|string[]} key - Dot notation, like `'a.b.c'` or `['a', 'b', 'c']`.
 * @return {string[]} - Array-type keys.
 */
function getPropParts(holder: Record<Key, unknown>, key: KeyVariadic): Key[] {
  return Array.isArray(key) ? clone(key) : (key + '').split('.')
}

/**
 * Determines whether the object has the given property.
 *
 * @param {Object} holder - Target object where to look property up.
 * @param {string} propPart - The current key of array-type keys.
 * @param {string[]} propParts - Array-type keys.
 * @param {string} property - The property to look up.
 * @return {boolean}
 */
function hasProperty<T extends Record<Key, unknown>>(
  holder: T,
  propPart: Key,
  propParts: Key[],
  property: Key
): property is keyof T {
  return property in holder && propPart !== property && !(propPart in holder)
}

/**
 * Get property value.
 *
 * @param {Object} holder - Target object where to look property up.
 * @param {string[]} propParts - Array-type keys
 * @return {*} - Property value
 */
function getValue(holder: Record<Key, unknown>, propParts: Key[]): unknown {
  let result: unknown = holder

  while (propParts.length && (isObject(result) || isArray(result))) {
    const propPart = propParts.shift() as Key

    if (propPart === null) {
      continue
    }

    if (isObject(result)) {
      if (hasProperty(result, propPart, propParts, 'data')) {
        propParts.unshift(propPart)
        result = result.data

        continue
      }

      if (hasProperty(result, propPart, propParts, 'attributes')) {
        propParts.unshift(propPart)
        result = result.attributes

        continue
      }

      result = result[propPart + '']
    } else {
      result = result[Number(propPart)]
    }
  }

  return result
}

/**
 * Get property defined by dot notation in string.
 *
 * Based on {@link https://github.com/dy/dotprop} (MIT)
 *
 * @param  {Object} holder - Target object where to look property up.
 * @param  {string|string[]} key - Dot notation, like `'a.b.c'` or `['a', 'b', 'c']`.
 * @return {*} - A property value.
 */
function getProp(holder: Record<string, unknown>, key: KeyVariadic): unknown {
  if (!key) {
    return holder
  }

  if (isString(key) && key in holder) {
    return holder[key]
  }

  const propParts = getPropParts(holder, key)

  return getValue(holder, propParts)
}

export default getProp
