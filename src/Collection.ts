import { variadic } from './helpers'

export default class Collection<T> extends Array<T> {
  constructor(...collection: T[] | [T[]]) {
    const items = variadic(collection)

    super(...items)
  }

  set items(collection: this) {
    this.splice(0, this.length, ...collection)
  }

  get items(): this {
    return this
  }
}
