import type { ItemData, KeyVariadic, Operator } from '../types'
import getProp from './getProp'
import { isString } from './is'

/**
 * Search for a specified pattern.
 *
 * @param {[Object, string} property
 * @param {string} value
 * @return {boolean}
 */
function likeOperation(property: string, value: string): boolean {
  switch (true) {
    case value.startsWith('%') && value.endsWith('%'): {
      const extractValue = new RegExp('%(.*)%', 'i')
      const _value = value.match(extractValue) as RegExpExecArray

      const operation = new RegExp(`^.*${_value[1]}.*$`, 'i')

      return !!property.match(operation)
    }

    case value.startsWith('_') && value.endsWith('%'): {
      const extractValue = new RegExp('_(.*)%', 'i')
      const _value = value.match(extractValue) as RegExpExecArray

      const operation = new RegExp(`^.${_value[1]}.*$`, 'i')

      return !!property.match(operation)
    }

    case value.endsWith('__%'): {
      const extractValue = new RegExp('(.*)__%', 'i')
      const _value = value.match(extractValue) as RegExpExecArray

      const operation = new RegExp(`^${_value[1]}\\s?\\w{2}.*$`, 'i')

      return !!property.match(operation)
    }

    case value.endsWith('_%'): {
      const extractValue = new RegExp('(.*)_%', 'i')
      const _value = value.match(extractValue) as RegExpExecArray

      const operation = new RegExp(`^${_value[1]}\\s?\\w.*$`, 'i')

      return !!property.match(operation)
    }

    case value.startsWith('%'): {
      const extractValue = new RegExp('%(.*)', 'i')
      const _value = value.match(extractValue) as RegExpExecArray

      const operation = new RegExp(`^.*${_value[1]}$`, 'i')

      return !!property.match(operation)
    }

    case value.endsWith('%'): {
      const extractValue = new RegExp('(.*)%', 'i')
      const _value = value.match(extractValue) as RegExpExecArray

      const operation = new RegExp(`^${_value[1]}.*$`, 'i')

      return !!property.match(operation)
    }

    case value.includes('%'): {
      const extractValue = new RegExp('(.*)%(.*)', 'i')
      const _value = value.match(extractValue) as RegExpExecArray

      const operation = new RegExp(`^${_value[1]}.*${_value[2]}$`, 'i')

      return !!property.match(operation)
    }

    default: {
      const operation = new RegExp(`^.*${value}.*$`, 'i')

      return !!property.match(operation)
    }
  }
}

/**
 * Compare two values using the given operator.
 *
 * @param {[Object, string|string[]]|unknown} property
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

      return likeOperation(property, value)
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
