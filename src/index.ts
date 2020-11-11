import Collection from './Collection'
import { variadic } from './helpers'

const collect = <Item extends Record<string, any> = Record<string, any>>(
  ...collection: Item[] | [Item[]]
): Collection<Item> => {
  const items = variadic(collection)

  return new Collection<Item>(items)
}

export default collect
export { collect, Collection }
