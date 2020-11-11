import { variadic } from './helpers'
import type { Constructor } from './types'

export default class Collection<
  T extends Record<string, any> = Record<string, any>
> extends Array<T> {
  constructor(...collection: T[] | [T[]]) {
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
}
