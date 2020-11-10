export default class Collection<T> extends Array<T> {
  constructor(...collection: any[]) {
    const items: T[] = Array.isArray(collection[0]) ? collection[0] : collection

    super(...items)
  }

  set items(collection: this) {
    this.splice(0, this.length, ...collection)
  }

  get items(): this {
    return this
  }
}
