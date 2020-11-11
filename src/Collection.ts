import { variadic } from './helpers'
import type { Constructor } from './types'

export default class Collection<
  Item extends Record<string, any> = Record<string, any>
> extends Array<Item> {
  constructor(...collection: Item[] | [Item[]]) {
    const items = variadic(collection)

    super(...items)
  }

  /**
   * Get the items of the array.
   */
  protected get items(): this {
    return this
  }

  /**
   * Set the items of the array.
   */
  protected set items(collection: this) {
    this.splice(0, this.length, ...collection)
  }

  /**
   * Creates a new instance of the Collection.
   */
  protected newInstance(collection: Item[]): this {
    const instance = this.constructor as Constructor<this>
    return new instance(collection)
  }
}
