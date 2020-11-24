import type { ExtractFunction } from '../../types'

/**
 * The isArray() method determines whether the passed value is an Array.
 *
 * @param {*} value
 * @return {boolean}
 */
export function isArray(value: unknown): value is Array<unknown> {
  return Array.isArray(value)
}

/**
 * The isObject() method determines whether the passed value is an Object.
 *
 * @param {*} value
 * @return {boolean}
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    Array.isArray(value) === false &&
    value !== null
  )
}

/**
 * The isFunction() method determines whether the passed value is a Function.
 *
 * @param {*} value
 * @return {boolean}
 */
export function isFunction<T>(value: T): value is ExtractFunction<T> {
  return typeof value === 'function'
}

/**
 * The isString() method determines whether the passed value is a String.
 *
 * @param {*} value
 * @return {boolean}
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * The isNumber() method determines whether the passed value is a Number.
 *
 * @param {*} value
 * @return {boolean}
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
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
