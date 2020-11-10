export default class Collection<T> extends Array<T> {
  constructor(...collection: any[]) {
    const items: T[] = Array.isArray(collection[0]) ? collection[0] : collection

    super(...items)
  }
}
