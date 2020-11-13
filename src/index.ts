import Collection from './Collection'
import { variadic } from './helpers'

function collect<Item extends Record<string, unknown>>(
  collection: Item[]
): Collection<Item>
function collect<Item extends Record<string, unknown>>(
  ...items: Item[]
): Collection<Item>
function collect<
  Item extends Record<string, unknown> = Record<string, unknown>
>(...collection: Item[] | [Item[]]): Collection<Item> {
  const items = variadic(collection)

  return new Collection<Item>(items)
}

export default collect
export { collect, Collection }
