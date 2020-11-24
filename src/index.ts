import type { ItemData } from '../types'
import Collection from './Collection'
import variadic from './helpers/variadic'

function collect<Item extends ItemData>(collection: Item[]): Collection<Item>
function collect<Item extends ItemData>(...items: Item[]): Collection<Item>
function collect<Item extends ItemData>(
  ...collection: Item[] | [Item[]]
): Collection<Item> {
  const items = variadic(collection)

  return new Collection<Item>(items)
}

export default collect
export { collect, Collection }
