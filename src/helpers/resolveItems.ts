import { ItemData } from '../../types'

/**
 * The resolveItems() method maps the items back to their original state based on isWrapped argument.
 *
 * @param {Object[]} items
 * @param {boolean} isWrapped
 * @return {boolean}
 */
function resolveItems<Item extends ItemData>(
  items: Item[],
  isWrapped: boolean
): Item[] {
  return items.map((item) => {
    if (isWrapped) {
      return { data: item }
    }

    return item
  }) as Item[]
}

export default resolveItems
