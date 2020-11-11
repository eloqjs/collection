import Collection from './Collection'
import { variadic } from './helpers'

const collect = <T extends Record<string, any> = Record<string, any>>(
  ...collection: T[] | [T[]]
): Collection<T> => {
  const items = variadic(collection)

  return new Collection<T>(items)
}

export default collect
export { collect, Collection }
