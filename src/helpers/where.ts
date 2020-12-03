import type { ItemData, KeyVariadic, Operator } from '../types'
import getProp from './getProp'
import { isNumber, isString } from './is'

/**
 * Extract value from value with wildcards.
 *
 * @param {string} regex
 * @param {string} value
 * @param {number|number[]} index
 * @return {string|string[]}
 */
function extractValue<T extends number | number[]>(
  regex: string,
  value: string,
  index: T
): T extends number ? string : string[]

/**
 * Extract value from value with wildcards.
 *
 * @param {string} regex
 * @param {string} value
 * @param {number|number[]} index
 * @return {string|string[]}
 */
function extractValue(
  regex: string,
  value: string,
  index: number | number[]
): string | string[] {
  const extractValue = new RegExp(regex, 'i')
  const _value = value.match(extractValue) as RegExpExecArray

  if (isNumber(index)) {
    return _value[index]
  }

  return _value.filter((_val, _index) => index.includes(_index))
}

/**
 * Resolve LIKE operation.
 *
 * @param {string} value
 * @return {RegExp}
 */
function resolveLikeOperation(value: string): RegExp {
  switch (true) {
    case value.startsWith('%') && value.endsWith('%'): {
      const _value = extractValue('%(.*)%', value, 1)
      return new RegExp(`^.*${_value}.*$`, 'i')
    }

    case value.startsWith('_') && value.endsWith('%'): {
      const _value = extractValue('_(.*)%', value, 1)
      return new RegExp(`^.${_value}.*$`, 'i')
    }

    case value.endsWith('__%'): {
      const _value = extractValue('(.*)__%', value, 1)
      return new RegExp(`^${_value}\\s?\\w{2}.*$`, 'i')
    }

    case value.endsWith('_%'): {
      const _value = extractValue('(.*)_%', value, 1)
      return new RegExp(`^${_value}\\s?\\w.*$`, 'i')
    }

    case value.endsWith('%'): {
      const _value = extractValue('(.*)%', value, 1)
      return new RegExp(`^${_value}.*$`, 'i')
    }

    case value.startsWith('%'): {
      const _value = extractValue('%(.*)', value, 1)
      return new RegExp(`^.*${_value}$`, 'i')
    }

    case value.includes('%'): {
      const [start, end] = extractValue('(.*)%(.*)', value, [1, 2])
      return new RegExp(`^${start}.*${end}$`, 'i')
    }

    default: {
      return new RegExp(`^.*${value}.*$`, 'i')
    }
  }
}

/**
 * Compare two values using the given operator.
 *
 * @param {unknown} property
 * @param {unknown} value
 * @param {string} operator
 * @return {boolean}
 */
export function compareValues(
  property: unknown,
  value: unknown,
  operator: Operator
): boolean {
  switch (operator) {
    case '==':
      return property == value

    default:
    case '===':
      return property === value

    case '!=':
    case '<>':
      return property != value

    case '!==':
      return property !== value

    case '<':
      return (property as never) < (value as never)

    case '<=':
      return (property as never) <= (value as never)

    case '>':
      return (property as never) > (value as never)

    case '>=':
      return (property as never) >= (value as never)

    case 'LIKE': {
      if (!isString(property) || !isString(value)) {
        return false
      }

      const operation = resolveLikeOperation(value)

      return !!property.match(operation)
    }
  }
}

/**
 * Return a filtered collection of items, where each item has the given values.
 *
 * @param {Collection} items
 * @param {string|string[]} key
 * @param {unknown[]} values
 * @param {boolean} [negate]
 * @return {boolean}
 */
export function whereHasValues<Item extends ItemData, K extends KeyVariadic>(
  items: Item[],
  key: keyof Item | K,
  values: unknown[],
  negate = false
): Item[] {
  return items.filter((item) => {
    const hasItem = values.indexOf(getProp(item, key as KeyVariadic)) !== -1
    return negate ? !hasItem : hasItem
  })
}
