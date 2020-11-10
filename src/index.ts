import Collection from './Collection'
import { variadic } from './utils'

const collect = <T>(...collection: T[] | [T[]]): Collection<T> => {
  const items = variadic(collection)

  return new Collection<T>(items)
}

export default collect
export { collect, Collection }
