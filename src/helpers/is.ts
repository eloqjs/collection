import type { ExtractFunction } from '../types'

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
 * The isWrapped() method determines whether the passed value is a  a wrapped in "data" key.
 *
 * @param {Object} value
 * @return {boolean}
 */
export function isWrapped(value: Record<string, unknown>): boolean {
  return !!value && 'data' in value
}
