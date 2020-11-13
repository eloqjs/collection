import { isFunction, isString, nestedValue, variadic } from './helpers'
import type { Constructor, Operator } from './types'

export default class Collection<
  Item extends Record<string, any> = Record<string, any>
> extends Array<Item> {
  constructor(collection: Item[])
  constructor(...items: Item[])
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
   * The chunk method breaks the collection into multiple, smaller collections of a given size.
   *
   * @param size - Size of the chunks.
   */
  public chunk(size: number): this[] {
    const chunks = []
    let index = 0

    do {
      const items = this.items.slice(index, index + size)
      const collection = this.newInstance(items)

      chunks.push(collection)
      index += size
    } while (index < this.items.length)

    return this.newCollection(chunks)
  }

  /**
   * The collapse method collapses an array of collections into a single, flat collection.
   */
  public collapse(...array: Array<Item[]> | [Array<Item[]>]): this {
    let arrayOfCollections: Array<Item[]>

    if (array.length === 1 && Array.isArray(array[0])) {
      arrayOfCollections = array[0] as Array<Item[]>
    } else {
      arrayOfCollections = array as Array<Item[]>
    }

    if (
      arrayOfCollections.length < 2 ||
      !Array.isArray(arrayOfCollections[0])
    ) {
      throw new Error(
        'The array must contain multiple collections. Use push() for single a collection.'
      )
    }

    arrayOfCollections.splice(0, 0, this.items)

    const collection = ([] as Item[]).concat(...arrayOfCollections)

    return this.newInstance(collection)
  }

  public contains(item: Item | ((...args: any[]) => any)): boolean
  public contains<V>(key: keyof Item, value: V): boolean

  /**
   * The contains method determines whether the collection contains a given item.
   */
  public contains<V>(
    key: keyof Item | Item | ((...args: any[]) => any),
    value?: V
  ): boolean {
    if (isFunction(key)) {
      return this.items.filter((item, index) => key(item, index)).length > 0
    }

    if (isString(key)) {
      if (value) {
        return (
          this.items.filter((items) => !!items[key] && items[key] === value)
            .length > 0
        )
      }

      return false
    }

    return (
      this.items.findIndex((item) => {
        return item[this.primaryKey()] === value?.[this.primaryKey()]
      }) !== -1
    )
  }

  /**
   * The count method returns the total number of items in the collection.
   */
  public count(): number {
    return this.items.length
  }

  /**
   * The dd method will console.log the collection and exit the current process.
   */
  public dd(): void {
    this.dump()

    if (typeof process !== 'undefined') {
      process.exit(1)
    }
  }

  /**
   * The diff method compares the collection against another collection or a plain array based on its values.
   * This method will return the values in the original collection that are not present in the given collection.
   */
  public diff(values: this, key: string = this.primaryKey()): this {
    const collection = this.items.filter((item) => {
      return (
        values.findIndex((value) => {
          return value[key] === item[key]
        }) === -1
      )
    })

    return this.newInstance(collection)
  }

  /**
   * The dump method outputs the results at that moment and then continues processing.
   */
  public dump(): this {
    // eslint-disable-next-line
    console.log(this)

    return this
  }

  /**
   * The each method iterates over the items in the collection and passes each item to a callback.
   */
  public each(
    fn: (item: Item, index?: number, items?: Item[]) => false | void
  ): this {
    let stop = false

    const { length } = this.items

    for (let index = 0; index < length && !stop; index += 1) {
      stop = fn(this.items[index], index, this.items) === false
    }

    return this
  }

  /**
   * The first method returns the first element in the collection that passes a given truth test.
   */
  public first(fn?: (item: Item) => boolean): Item {
    if (isFunction(fn)) {
      for (let i = 0, { length } = this.items; i < length; i += 1) {
        const item = this.items[i]
        if (fn(item)) {
          return item
        }
      }

      return {} as Item
    }

    if (this.items.length) {
      return this.items[0]
    }

    return {} as Item
  }

  public firstWhere<V extends unknown>(key: keyof Item, value: V): Item
  public firstWhere<V extends unknown>(
    key: keyof Item,
    operator: Operator,
    value: V
  ): Item

  /**
   * The firstWhere method returns the first element in the collection with the given key / value pair.
   */
  public firstWhere<V extends unknown>(
    key: keyof Item | string,
    operator: V | Operator,
    value?: V
  ): Item {
    return this.where(key, operator as Operator, value).first() || {}
  }

  public where<V extends unknown>(key: keyof Item | string, value?: V): this
  public where<V extends unknown>(
    key: keyof Item,
    operator: Operator,
    value: V
  ): this

  /**
   * The where method filters the collection by a given key / value pair.
   */
  public where<V extends unknown>(
    key: keyof Item | string,
    operator?: V | Operator,
    value?: V
  ): this {
    if (!isString(key)) {
      throw new Error('KEY must be an string.')
    }

    let comparisonOperator = operator
    let comparisonValue = value

    const items = this.items

    if (operator === undefined || operator === true) {
      return this.newInstance(
        items.filter((item) => nestedValue(item, key as string))
      )
    }

    if (operator === false) {
      return this.newInstance(
        items.filter((item) => !nestedValue(item, key as string))
      )
    }

    if (value === undefined) {
      comparisonValue = operator as V
      comparisonOperator = '==='
    }

    const collection = items.filter((item) => {
      switch (comparisonOperator) {
        case '==':
          return (
            nestedValue(item, key) === Number(comparisonValue) ||
            nestedValue(item, key) === (comparisonValue as any).toString()
          )

        default:
        case '===':
          return nestedValue(item, key) === comparisonValue

        case '!=':
        case '<>':
          return (
            nestedValue(item, key) !== Number(comparisonValue) &&
            nestedValue(item, key) !== (comparisonValue as any).toString()
          )

        case '!==':
          return nestedValue(item, key) !== comparisonValue

        case '<':
          return nestedValue(item, key) < (comparisonValue as any)

        case '<=':
          return nestedValue(item, key) <= (comparisonValue as any)

        case '>':
          return nestedValue(item, key) > (comparisonValue as any)

        case '>=':
          return nestedValue(item, key) >= (comparisonValue as any)
      }
    })

    return this.newInstance(collection)
  }

  /**
   * Creates a new instance of the Collection.
   */
  protected newInstance(...collection: Item[] | [Item[]]): this {
    const items = variadic(collection)
    const instance = this.constructor as Constructor<this>

    return new instance(items)
  }

  /**
   * Wrap an array with another collection library.
   */
  protected newCollection(array: any[]): any[] {
    return array
  }

  /**
   * Get the primary key for the item.
   */
  protected primaryKey(): string {
    return 'id'
  }

  /**
   * Get the value of the item's primary key.
   */
  protected getPrimaryKey(item: Item): string | number {
    return item[this.primaryKey()]
  }
}
