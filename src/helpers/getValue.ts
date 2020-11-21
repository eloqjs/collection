import { isFunction } from './is'

/**
 * Return the default value of the given value.
 *
 * @param {unknown} value
 * @return {unknown}
 */
function getValue<V>(value: V | (() => V)): V {
  if (isFunction(value)) {
    return value()
  }

  return value
}

export default getValue
