import type { ItemData, KeyVariadic, Operator } from '../../types'
import getProp from './getProp'

/**
 * Compare two values using the given operator.
 *
 * @param {[Object, string|string[]]|unknown} value1
 * @param {unknown} value2
 * @param {string} operator
 * @return {boolean}
 */
export function compareValues(
  value1: unknown,
  value2: unknown,
  operator: Operator
): boolean {
  switch (operator) {
    case '==':
      return value1 == value2

    default:
    case '===':
      return value1 === value2

    case '!=':
    case '<>':
      return value1 != value2

    case '!==':
      return value1 !== value2

    case '<':
      return (value1 as never) < (value2 as never)

    case '<=':
      return (value1 as never) <= (value2 as never)

    case '>':
      return (value1 as never) > (value2 as never)

    case '>=':
      return (value1 as never) >= (value2 as never)
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
