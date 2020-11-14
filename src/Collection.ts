import {
  buildKeyPathMap,
  clone,
  getProp,
  isArray,
  isFunction,
  isString,
  matches,
  variadic
} from './helpers'
import type { Constructor, Operator } from './types'

export default class Collection<
  Item extends Record<string, unknown> = Record<string, unknown>
> extends Array<Item> {
  constructor(collection: Item[])
  constructor(...items: Item[])
  constructor(...collection: Item[] | [Item[]]) {
    const items = variadic(collection)

    super(...items)
  }

  /**
   * Get the items of the array.
   *
   * @return {Collection}
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
   * @return {Object[]}
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

    return chunks
  }

  /**
   * The collapse method collapses an array of collections into a single, flat collection.
   * @param {...*} array
   * @return {Collection}
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

  public contains(item: Item | ((item: Item) => boolean)): boolean
  public contains<V, K extends string>(key: keyof Item | K, value: V): boolean

  /**
   * The contains method determines whether the collection contains a given item.
   *
   * @param {string|Object|Function} key
   * @param [value]
   * @return {boolean}
   */
  public contains<V, K extends string>(
    key: keyof Item | K | Item | ((item: Item) => unknown),
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
        return item[this.primaryKey()] === key[this.primaryKey()]
      }) !== -1
    )
  }

  /**
   * The count method returns the total number of items in the collection.
   *
   * @return {number}
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
   *
   * @param {Collection} values
   * @param {string} key
   * @return {Collection}
   */
  public diff<K extends string>(
    values: this,
    key: keyof Item | K = this.primaryKey()
  ): this {
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
   *
   * @return {Collection}
   */
  public dump(): this {
    // eslint-disable-next-line
    console.log(this)

    return this
  }

  /**
   * The each method iterates over the items in the collection and passes each item to a callback.
   *
   * @param {Function} fn
   * @return {Collection}
   */
  public each(
    fn: (item: Item, index: number, items: Item[]) => false | void
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
   *
   * @param {Function} fn
   * @return {Object}
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

  public firstWhere<V extends unknown, K extends string>(
    key: keyof Item | K,
    value?: V
  ): Item
  public firstWhere<V extends unknown, K extends string>(
    key: keyof Item | K,
    operator: Operator,
    value: V
  ): Item

  /**
   * The firstWhere method returns the first element in the collection with the given key / value pair.
   *
   * @param {string} key
   * @param {string} [operator]
   * @param {*} [value]
   * @return {Object}
   */
  public firstWhere<V extends unknown, K extends string>(
    key: keyof Item | K,
    operator: V | Operator,
    value?: V
  ): Item {
    return this.where(key, operator as Operator, value).first()
  }

  /**
   * The forPage method returns a new collection containing the items that would be present on a given page number.
   * The method accepts the page number as its first argument
   * and the number of items to show per page as its second argument.
   *
   * @param {number} page
   * @param {number} chunk
   * @return {Collection}
   */
  forPage(page: number, chunk: number): this {
    const collection = this.items.slice(page * chunk - chunk, page * chunk)

    return this.newInstance(collection)
  }

  /**
   * The forget method removes an item from the collection by its key.
   *
   * @param {number} index
   * @return {Collection}
   */
  forget(index: number): this {
    this.items.splice(index, 1)

    return this
  }

  /**
   * The get method returns the item at a given key. If the key does not exist, null is returned.
   *
   * @param {number} index
   * @return {Object|null}
   */
  get(index: number): Item | null {
    if (this.items[index] !== undefined) {
      return this.items[index]
    }

    return null
  }

  /**
   * The groupBy method groups the collection's items by a given key.
   *
   * @param {Function|string} key
   * @return {Object}
   */
  groupBy<K extends string>(
    key: ((item: Item, index?: number) => K) | keyof Item | K
  ): Record<string, unknown> {
    const collection = {}

    this.items.forEach((item, index) => {
      let resolvedKey: string | number = ''

      if (isFunction(key)) {
        resolvedKey = key(item, index) as string
      } else if (
        (isString(key) || isArray(key)) &&
        getProp(item, key as string | string[]) !== undefined
      ) {
        resolvedKey = getProp(item, key as string | string[]) as string | number
      }

      if (collection[resolvedKey] === undefined) {
        collection[resolvedKey] = this.newInstance([])
      }

      collection[resolvedKey].push(item)
    })

    return collection
  }

  /**
   * The implode method joins the items in a collection.
   *
   * @param {string} key - The key of the attributes you wish to join.
   * @param {string} glue - The "glue" string you wish to place between the values.
   * @return {string}
   */
  implode<K extends string>(key: keyof Item | K, glue: string): string {
    return this.pluck(key).join(glue)
  }

  pluck<V>(value: keyof Item | V): unknown[]
  pluck<V, K extends string>(
    value: keyof Item | V,
    key: keyof Item | K
  ): Record<string, unknown>

  /**
   * The pluck method retrieves all of the values for a given key.
   *
   * @param {string} value
   * @param {string} [key]
   * @return {[]|Object}
   */
  pluck<V, K extends string>(
    value: keyof Item | V,
    key?: keyof Item | K
  ): unknown[] | Record<string, unknown> {
    if ((value as string).indexOf('*') !== -1) {
      const keyPathMap = buildKeyPathMap(this.items)
      const keyMatches: unknown[] = []

      if (key) {
        keyMatches.push(...matches(key as string, keyPathMap))
      }

      const valueMatches: unknown[] = []
      valueMatches.push(...matches(value as string, keyPathMap))

      if (key) {
        const collection = {}

        this.items.forEach((item, index) => {
          collection[(keyMatches[index] as string) || ''] = valueMatches
        })

        return collection
      }

      return [valueMatches]
    }

    if (key) {
      const collection = {}

      this.items.forEach((item) => {
        if (getProp(item, value as string) !== undefined) {
          collection[(item[key as string] as string) || ''] = getProp(
            item,
            value as string
          )
        } else {
          collection[(item[key as string] as string) || ''] = null
        }
      })

      return collection
    }

    return clone(
      this.map((item) => {
        if (getProp(item, value as string) !== undefined) {
          return getProp(item, value as string)
        }

        return null
      })
    )
  }

  public where<V extends unknown, K extends string>(
    key: keyof Item | K,
    value?: V
  ): this
  public where<V extends unknown, K extends string>(
    key: keyof Item | K,
    operator: Operator,
    value: V
  ): this

  /**
   * The where method filters the collection by a given key / value pair.
   *
   * @param {string} key
   * @param {string} [operator]
   * @param {*} [value]
   * @return {Object}
   */
  public where<V extends unknown, K extends string>(
    key: keyof Item | K,
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
        items.filter((item) => getProp(item, key as string))
      )
    }

    if (operator === false) {
      return this.newInstance(
        items.filter((item) => !getProp(item, key as string))
      )
    }

    if (value === undefined) {
      comparisonValue = operator as V
      comparisonOperator = '==='
    }

    const collection = items.filter((item) => {
      switch (comparisonOperator) {
        case '==':
          return getProp(item, key) == comparisonValue

        default:
        case '===':
          return getProp(item, key) === comparisonValue

        case '!=':
        case '<>':
          return getProp(item, key) != comparisonValue

        case '!==':
          return getProp(item, key) !== comparisonValue

        case '<':
          return (getProp(item, key) as never) < (comparisonValue as never)

        case '<=':
          return (getProp(item, key) as never) <= (comparisonValue as never)

        case '>':
          return (getProp(item, key) as never) > (comparisonValue as never)

        case '>=':
          return (getProp(item, key) as never) >= (comparisonValue as never)
      }
    })

    return this.newInstance(collection)
  }

  /**
   * Creates a new instance of the Collection.
   *
   * @param {...*} collection
   * @return {Collection}
   */
  protected newInstance(...collection: Item[] | [Item[]]): this {
    const items = variadic(collection)
    const instance = this.constructor as Constructor<this>

    return new instance(items)
  }

  /**
   * Get the primary key for the item.
   *
   * @return {string}
   */
  protected primaryKey(): string {
    return 'id'
  }

  /**
   * Get the value of the item's primary key.
   *
   * @param {Object} item
   * @return {string|number}
   */
  protected getPrimaryKey(item: Item): string | number {
    return item[this.primaryKey()] as string | number
  }
}
