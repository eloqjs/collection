import Collection from './Collection'

const collect = <T>(...collection: any[]): Collection<T> => {
  const items: T[] = Array.isArray(collection[0]) ? collection[0] : collection

  return new Collection(items)
}

export default collect
export { collect, Collection }
