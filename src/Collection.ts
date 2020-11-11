import { variadic } from './helpers'

export default class Collection<T extends Record<string, any>> extends Array<
  T
> {
  constructor(...collection: T[] | [T[]]) {
    const items = variadic(collection)

    super(...items)
  }

  protected get items(): this {
    return this
  }

  protected set items(collection: this) {
    this.splice(0, this.length, ...collection)
  }
}
