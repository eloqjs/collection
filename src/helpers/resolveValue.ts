import type { ItemData, KeyVariadic } from '../types'
import getProp from './getProp'
import { isFunction, isObject } from './is'

/**
 * Return the value from the given item.
 *
 * @param {Object|unknown} item
 * @param {unknown} keyOrCallback
 * @return {unknown}
 */
function resolveValue<Item extends ItemData, K extends KeyVariadic, V>(
  item: Item | V,
  keyOrCallback: keyof Item | K | ((item: Item) => unknown)
): V | unknown

/**
 * Return the value from the given item.
 *
 * @param {Object|unknown} item
 * @param {unknown} keyOrCallback
 * @param {number} index
 * @return {unknown}
 */
function resolveValue<Item extends ItemData, K extends KeyVariadic, V>(
  item: Item | V,
  keyOrCallback: keyof Item | K | ((item: Item, index: number) => unknown),
  index: number
): V | unknown

/**
 * Return the value from the given item.
 *
 * @param {Object|unknown} item
 * @param {unknown} keyOrCallback
 * @param {number} index
 * @return {unknown}
 */
function resolveValue<Item extends ItemData, K extends KeyVariadic, V>(
  item: Item | V,
  keyOrCallback: keyof Item | K | ((item: Item, index?: number) => unknown),
  index?: number
): V | unknown {
  if (!isObject(item)) {
    return item
  }

  if (isFunction(keyOrCallback)) {
    return keyOrCallback(item, index)
  }

  return getProp(item, keyOrCallback as K)
}

export default resolveValue
