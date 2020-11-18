import equal from 'deep-equal'

import {
  buildKeyPathMap,
  clone,
  getProp,
  isFunction,
  isString,
  matches,
  variadic
} from './helpers'
import type {
  ClassConstructor,
  Constructor,
  ItemData,
  Key,
  KeyVariadic,
  Operator
} from './types'
import { ClassCollection } from './types'

export default class Collection<Item extends ItemData = ItemData> extends Array<
  Item
> {
  constructor(collection: Item[])
  constructor(...items: Item[])
  constructor(...collection: Item[] | [Item[]]) {
    const items = variadic(collection)

    super(...items)
  }

  /**
   * Get the items of the array.
   *
   * @return {this}
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
   * Alias for the avg() method.
   *
   * @param {string|string[]} key
   * @return {number}
   */
  average<K extends KeyVariadic>(key: keyof Item | K): number {
    return this.avg(key)
  }

  /**
   * The avg method returns the average of all items in the collection.
   *
   * @param {string|string[]} key
   * @return {number}
   */
  avg<K extends KeyVariadic>(key: keyof Item | K): number {
    return this.sum(key) / this.items.length
  }

  /**
   * The chunk method breaks the collection into multiple, smaller collections of a given size.
   *
   * @param size - Size of the chunks.
   * @return {Object[]}
   */
  public chunk(size: number): Collection<Item>[] {
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
  public collapse(...array: Array<Item[]> | [Array<Item[]>]): Collection<Item> {
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

  public contains(
    item: Item | ((item: Item, index: number) => boolean)
  ): boolean
  public contains<V, K extends Key>(key: keyof Item | K, value: V): boolean

  /**
   * The contains method determines whether the collection contains a given item.
   *
   * @param {string|Object|Function} key
   * @param [value]
   * @return {boolean}
   */
  public contains<V, K extends Key>(
    key: keyof Item | K | Item | ((item: Item, index: number) => unknown),
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
   * The countBy method counts the occurrences of values in the collection.
   *
   * @param {Function} callback
   * @return {Object}
   */
  public countBy(
    callback: (item: Item, index: number) => Key
  ): Record<string, number> {
    const group = this.groupBy(callback)

    return Object.keys(group).reduce((result, key) => {
      result[key] = (group[key] as unknown[]).length
      return result
    }, {})
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
  public diff<K extends Key>(
    values: this,
    key: keyof Item | K = this.primaryKey()
  ): Collection<Item> {
    const collection = this.items.filter((item) => {
      return (
        values.findIndex((value) => {
          const _key = key.toString()
          return value[_key] === item[_key]
        }) === -1
      )
    })

    return this.newInstance(collection)
  }

  /**
   * The dump method outputs the results at that moment and then continues processing.
   *
   * @return {this}
   */
  public dump(): this {
    // eslint-disable-next-line
    console.log(this)

    return this
  }

  /**
   * The each method iterates over the items in the collection and passes each item to a callback.
   *
   * @param {Function} callback
   * @return {this}
   */
  public each(
    callback: (item: Item, index: number, items: Item[]) => false | void
  ): this {
    let stop = false

    const { length } = this.items

    for (let index = 0; index < length && !stop; index += 1) {
      stop = callback(this.items[index], index, this.items) === false
    }

    return this
  }

  /**
   * The first method returns the first element in the collection that passes a given truth test.
   *
   * @param {Function} [callback]
   * @return {Object}
   */
  public first(callback?: (item: Item) => boolean): Item {
    if (isFunction(callback)) {
      for (let i = 0, { length } = this.items; i < length; i += 1) {
        const item = this.items[i]
        if (callback(item)) {
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

  public firstWhere<V extends unknown, K extends Key>(
    key: keyof Item | K,
    value?: V
  ): Item
  public firstWhere<V extends unknown, K extends Key>(
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
  public firstWhere<V extends unknown, K extends Key>(
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
  forPage(page: number, chunk: number): Collection<Item> {
    const collection = this.items.slice(page * chunk - chunk, page * chunk)

    return this.newInstance(collection)
  }

  /**
   * The forget method removes an item from the collection by its key.
   *
   * @param {number} index
   * @return {this}
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
  groupBy<K extends KeyVariadic>(
    key: keyof Item | K | ((item: Item, index: number) => Key)
  ): Record<string, unknown> {
    const collection = {}

    this.items.forEach((item, index) => {
      let resolvedKey: Key = ''

      if (isFunction(key)) {
        resolvedKey = key(item, index)
      } else {
        const value = getProp(item, key as KeyVariadic) as Key

        if (value !== undefined) {
          resolvedKey = value
        }
      }

      if (collection[resolvedKey] === undefined) {
        collection[resolvedKey] = []
      }

      collection[resolvedKey].push(item)
    })

    return collection
  }

  /**
   * The intersect method removes any values from the original collection
   * that are not present in the given array or collection.
   * The resulting collection will preserve the original collection's keys.
   *
   * @param {Collection} values
   * @param {string} key
   * @return {Collection}
   */
  intersect<K extends Key>(
    values: this,
    key: keyof Item | K = this.primaryKey()
  ): Collection<Item> {
    const collection = this.items.filter((item) => {
      return (
        values.findIndex((value) => {
          const _key = key.toString()
          return value[_key] === item[_key]
        }) !== -1
      )
    })

    return this.newInstance(collection)
  }

  /**
   * The implode method joins the items in a collection.
   *
   * @param {string} key - The key of the attributes you wish to join.
   * @param {string} glue - The "glue" string you wish to place between the values.
   * @return {string}
   */
  implode<K extends Key>(key: keyof Item | K, glue: string): string {
    return this.pluck(key).join(glue)
  }

  /**
   * The isEmpty method returns true if the collection is empty; otherwise, false is returned.
   *
   * @return {boolean}
   */
  isEmpty(): boolean {
    return !this.items.length
  }

  /**
   * The isNotEmpty method returns true if the collection is not empty; otherwise, false is returned.
   *
   * @return {boolean}
   */
  isNotEmpty(): boolean {
    return !this.isEmpty()
  }

  /**
   * The keyBy method keys the collection by the given key.
   * If multiple items have the same key, only the last one will appear in the new collection.
   *
   * @param {string|string[]|Function} key
   * @return {Object}
   */
  keyBy<K extends KeyVariadic>(
    key: keyof Item | K | ((item: Item) => Key)
  ): Record<Key, Item> {
    const collection: Record<Key, Item> = {}

    if (isFunction(key)) {
      this.items.forEach((item) => {
        collection[key(item) as Key] = item
      })
    } else {
      this.items.forEach((item) => {
        const keyValue = (getProp(item, key as KeyVariadic) as Key) || ''

        collection[keyValue] = item
      })
    }

    return collection
  }

  /**
   * The last method returns the last element in the collection that passes a given truth test.
   *
   * @param {Function} [callback]
   * @return {Object}
   */
  last(callback?: (item: Item) => boolean): Item {
    let items: Item[] = clone(this.items)

    if (isFunction(callback)) {
      items = items.filter(callback)
    }

    return items[items.length - 1]
  }

  /**
   * The mapInto method iterates through the collection and instantiates the given class with each element as a constructor.
   *
   * @param {Function} classConstructor
   * @param {Function} [callback]
   * @return {Collection}
   */
  mapInto<T extends Item>(
    classConstructor: ClassConstructor<T, Item>,
    callback?: (item: T) => void
  ): Collection<T> {
    return this.items.map((item) => {
      let _item: T = item as T

      if (!(item instanceof classConstructor)) {
        _item = new classConstructor(item)
      }

      if (isFunction(callback)) {
        callback(_item)
      }

      return _item
    }) as Collection<T>
  }

  /**
   * The mapToGroups method iterates through the collection and passes each value to the given callback.
   *
   * @param {Function} callback
   * @return {Object}
   */
  mapToGroups(
    callback: (item: Item, index: number) => [Key, unknown]
  ): Record<string, unknown> {
    const collection = {}

    this.items.forEach((item, index) => {
      const [key, value] = callback(item, index)

      if (collection[key] === undefined) {
        collection[key] = [value]
      } else {
        collection[key].push(value)
      }
    })

    return collection
  }

  /**
   * The mapWithKeys method iterates through the collection and passes each value to the given callback.
   * The callback should return an array where the first element represents the key
   * and the second element represents the value pair.
   *
   * @param {Function} callback
   * @return {Object}
   */
  mapWithKeys(
    callback: (item: Item) => [Key, unknown]
  ): Record<string, unknown> {
    const collection = {}

    this.items.forEach((item) => {
      const [key, value] = callback(item)
      collection[key] = value
    })

    return collection
  }

  /**
   * The max method returns the maximum value of a given key.
   *
   * @param {string|string[]} key
   * @return {number}
   */
  max<K extends KeyVariadic>(key: keyof Item | K): number {
    const filtered = this.items.filter(
      (item) => getProp(item, key as KeyVariadic) !== undefined
    )

    return Math.max(
      ...filtered.map((item) => getProp(item, key as KeyVariadic) as number)
    )
  }

  /**
   * The median method returns the [median value]{@link https://en.wikipedia.org/wiki/Median} of a given key.
   *
   * @param {string|string[]} key
   * @return {number}
   */
  median<K extends KeyVariadic>(key: keyof Item | K): number {
    const { length } = this.items

    if (length % 2 === 0) {
      return (
        ((getProp(this.items[length / 2 - 1], key as KeyVariadic) as number) +
          (getProp(this.items[length / 2], key as KeyVariadic) as number)) /
        2
      )
    }

    return getProp(
      this.items[Math.floor(length / 2)],
      key as KeyVariadic
    ) as number
  }

  /**
   * The min method returns the minimum value of a given key.
   *
   * @param {string|string[]} key
   * @return {number}
   */
  min<K extends KeyVariadic>(key: keyof Item | K): number {
    const filtered = this.items.filter(
      (item) => getProp(item, key as KeyVariadic) !== undefined
    )

    return Math.min(
      ...filtered.map((item) => getProp(item, key as KeyVariadic) as number)
    )
  }

  /**
   * The mode method returns the [mode value]{@link https://en.wikipedia.org/wiki/Mode_(statistics)} of a given key.
   *
   * @param {string|string[]} key
   * @return {number}
   */
  mode<K extends KeyVariadic>(key: keyof Item | K): number[] | null {
    const values: { key: number; count: number }[] = []
    let highestCount = 1

    if (this.isEmpty()) {
      return null
    }

    this.items.forEach((item) => {
      const tempValues = values.filter((value) => {
        return value.key === getProp(item, key as KeyVariadic)
      })

      if (!tempValues.length) {
        values.push({
          key: getProp(item, key as KeyVariadic) as number,
          count: 1
        })
      } else {
        tempValues[0].count += 1
        const { count } = tempValues[0]

        if (count > highestCount) {
          highestCount = count
        }
      }
    })

    return values
      .filter((value) => value.count === highestCount)
      .map((value) => value.key)
  }

  /**
   * The nth method creates a new collection consisting of every n-th element.
   *
   * @param {number} step
   * @param {number} [offset]
   */
  nth(step: number, offset?: number): Collection<Item> {
    const collection = this.items
      .slice(offset)
      .filter((item, index) => index % step === 0)

    return this.newInstance(collection)
  }

  /**
   * The partition method may be combined with destructuring to separate elements
   * that pass a given truth test from those that do not.
   *
   * @param {Function} callback
   * @return {[Collection, Collection]}
   */
  partition(
    callback: (item: Item) => boolean
  ): [Collection<Item>, Collection<Item>] {
    const arrays: [Collection<Item>, Collection<Item>] = [
      this.newInstance([]),
      this.newInstance([])
    ]

    this.items.forEach((item) => {
      if (callback(item)) {
        arrays[0].push(item)
      } else {
        arrays[1].push(item)
      }
    })

    return arrays
  }

  /**
   * The pipe method passes the collection to the given callback and returns the result.
   *
   * @param {Function} callback
   * @return {*}
   */
  pipe<U>(callback: (collection: this) => U): U {
    return callback(this)
  }

  /**
   * The pipeInto method creates a new instance of the given class and passes the collection into the constructor.
   *
   * @param {Function} classConstructor
   * @return {Function}
   */
  pipeInto<T>(classConstructor: ClassCollection<T, this>): T {
    return new classConstructor(this)
  }

  pluck<V extends Key>(value: keyof Item | V): unknown[]
  pluck<V extends Key, K extends Key>(
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
  pluck<V extends Key, K extends Key>(
    value: keyof Item | V,
    key?: keyof Item | K
  ): unknown[] | Record<string, unknown> {
    if ((value as string).indexOf('*') !== -1) {
      const keyPathMap = buildKeyPathMap(this.items)
      const keyMatches: unknown[] = []

      if (key) {
        keyMatches.push(...matches(key as Key, keyPathMap))
      }

      const valueMatches: unknown[] = []
      valueMatches.push(...matches(value as Key, keyPathMap))

      if (key) {
        const collection = {}

        this.items.forEach((item, index) => {
          collection[(keyMatches[index] as Key) || ''] = valueMatches
        })

        return collection
      }

      return [valueMatches]
    }

    if (key) {
      const collection = {}

      this.items.forEach((item) => {
        if (getProp(item, value as Key) !== undefined) {
          collection[(item[key as Key] as Key) || ''] = getProp(
            item,
            value as Key
          )
        } else {
          collection[(item[key as Key] as Key) || ''] = null
        }
      })

      return collection
    }

    return clone(
      this.map((item) => {
        if (getProp(item, value as Key) !== undefined) {
          return getProp(item, value as Key)
        }

        return null
      })
    )
  }

  /**
   * The prepend method adds an item to the beginning of the collection.
   *
   * @param {Object} value
   * @return {this}
   */
  prepend(value: Item): this {
    this.items.unshift(value)

    return this
  }

  /**
   * The pull method removes and returns an item from the collection by its key.
   *
   * @param {number} index
   * @return {Object|null}
   */
  pull(index: number): Item | null {
    const returnValue = this.items[index] || null
    this.items.splice(index, 1)

    return returnValue
  }

  /**
   * The put method sets the given key and value in the collection.
   *
   * @param {Object} item
   * @param {number} [index]
   * @return {this}
   */
  put(item: Item, index?: number): this {
    if (index !== undefined) {
      this.items.splice(index, 1, item)
    } else {
      this.items.push(item)
    }

    return this
  }

  random(): Item
  random(length: number): Collection<Item>

  /**
   * The random method returns a random item from the collection.
   *
   * @param {number} length
   * @return {Object|Collection}
   */
  random(length?: number): Item | Collection<Item> {
    const collection = this.newInstance(clone(this.items)).shuffle()

    // If not a length was specified
    if (!length) {
      return collection.first()
    }

    return collection.take(length)
  }

  /**
   * The reject method filters the collection using the given callback.
   * The callback should return true if the item should be removed from the resulting collection.
   *
   * @param {Function} callback
   * @return {Collection}
   */
  reject(callback: (item: Item) => boolean): Collection<Item> {
    return this.newInstance(this.items).filter(
      (item) => !callback(item)
    ) as Collection<Item>
  }

  /**
   * The search method searches the collection for the given value and returns its key if found.
   * If the item is not found, false is returned.
   *
   * @param {Function} callback
   * @return {number|boolean}
   */
  search(callback: (item: Item, index: number) => boolean): number | false {
    const result = this.items.findIndex((item, index) => {
      return callback(this.items[index], index)
    })

    if (result === undefined || result < 0) {
      return false
    }

    return result
  }

  /**
   * The shuffle method randomly shuffles the items in the collection.
   *
   * @return {this}
   */
  shuffle(): this {
    const items = clone(this.items)

    let j
    let x
    let i

    for (i = items.length; i; i -= 1) {
      j = Math.floor(Math.random() * i)
      x = items[i - 1]
      items[i - 1] = items[j]
      items[j] = x
    }

    this.items = items

    return this
  }

  /**
   * The skip method returns a new collection, without the first given amount of items.
   *
   * @param {number} number
   * @return {Collection}
   */
  skip(number: number): Collection<Item> {
    return this.newInstance(this.items.slice(number))
  }

  /**
   * The skipUntil method skips items until the given callback returns true and
   * then returns the remaining items in the collection.
   * You may also pass a simple value to the skipUntil method to skip all items until the given value is found.
   *
   * @param {Object|Function} value
   * @return {Collection}
   */
  skipUntil(value: Item | ((item: Item) => boolean)): Collection<Item> {
    let previous: boolean | null = null

    const callback = isFunction(value)
      ? value
      : (item: Item) => equal(item, value)

    const items = this.items.filter((item) => {
      if (previous !== true) {
        previous = callback(item)
      }

      return previous
    })

    return this.newInstance(items)
  }

  /**
   * The skipWhile method skips items while the given callback returns true and
   * then returns the remaining items in the collection
   * You may also pass a simple value to the skipWhile.
   *
   * @param {Object|Function} value
   * @return {Collection}
   */
  skipWhile(value: Item | ((item: Item) => boolean)): Collection<Item> {
    let previous: boolean | null = null

    const callback = isFunction(value)
      ? value
      : (item: Item) => equal(item, value)

    const items = this.items.filter((item) => {
      if (previous !== true) {
        previous = !callback(item)
      }

      return previous
    })

    return this.newInstance(items)
  }

  /**
   * The sortBy method sorts the collection by the given key.
   * The sorted collection keeps the original array keys.
   *
   * @param {string|string[]|Function} value
   * @return {Collection}
   */
  sortBy<K extends KeyVariadic>(
    value: keyof Item | K | ((item: Item) => number)
  ): Collection<Item> {
    const collection = clone(this.items)
    const getValue = (item: Item): number => {
      if (isFunction(value)) {
        return value(item)
      }

      return getProp(item, value as KeyVariadic) as number
    }

    collection.sort((a, b) => {
      const valueA = getValue(a)
      const valueB = getValue(b)

      if (valueA === null || valueA === undefined) {
        return 1
      }
      if (valueB === null || valueB === undefined) {
        return -1
      }

      if (valueA < valueB) {
        return -1
      }
      if (valueA > valueB) {
        return 1
      }

      return 0
    })

    return this.newInstance(collection)
  }

  /**
   * This method has the same signature as the sortBy method,
   * but will sort the collection in the opposite order.
   *
   * @param {string|string[]|Function} value
   * @return {Collection}
   */
  sortByDesc<K extends KeyVariadic>(
    value: keyof Item | K | ((item: Item) => number)
  ): Collection<Item> {
    return this.sortBy(value).reverse() as Collection<Item>
  }

  /**
   * The split method breaks a collection into the given number of groups.
   *
   * @param {number} numberOfGroups
   * @return {Collection[]}
   */
  split(numberOfGroups: number): Collection<Item>[] {
    const itemsPerGroup = Math.round(this.items.length / numberOfGroups)
    const collection = []

    for (let iterator = 0; iterator < numberOfGroups; iterator += 1) {
      collection.push(this.newInstance(this.items.splice(0, itemsPerGroup)))
    }

    return collection
  }

  /**
   * The sum method returns the sum of all items in the collection.
   *
   * @param {string|string[]|Function} key
   * @return {number}
   */
  sum<K extends KeyVariadic>(
    key: keyof Item | K | ((item: Item) => string | number)
  ): number {
    let total = 0

    if (isFunction(key)) {
      for (const item of this.items) {
        const value = key(item)
        total += isString(value) ? parseFloat(value) : value
      }
    } else {
      for (const item of this.items) {
        const value = getProp(item, key as KeyVariadic) as string | number
        total += isString(value) ? parseFloat(value) : value
      }
    }

    return parseFloat(total.toPrecision(12))
  }

  /**
   * The take method returns a new collection with the specified number of items.
   * You may also pass a negative integer to take the specified amount of items from the end of the collection.
   *
   * @param {number} length
   */
  take(length: number): Collection<Item> {
    if (length < 0) {
      return this.newInstance(this.items.slice(length))
    }

    return this.newInstance(this.items.slice(0, length))
  }

  /**
   * The takeUntil method returns items in the collection until the given callback returns true.
   * You may also pass a simple value to the takeUntil method to get the items until the given value is found.
   *
   * @param {Object|Function} value
   * @return {Collection}
   */
  takeUntil(value: Item | ((item: Item) => boolean)): Collection<Item> {
    let previous: boolean | null = null

    const callback = isFunction(value)
      ? value
      : (item: Item) => equal(item, value)

    const items = this.items.filter((item) => {
      if (previous !== false) {
        previous = !callback(item)
      }

      return previous
    })

    return this.newInstance(items)
  }

  /**
   * The takeWhile method returns items in the collection until the given callback returns false.
   *
   * @param {Object|Function} value
   * @return {Collection}
   */
  takeWhile(value: Item | ((item: Item) => boolean)): Collection<Item> {
    let previous: boolean | null = null

    const callback = isFunction(value)
      ? value
      : (item: Item) => equal(item, value)

    const items = this.items.filter((item) => {
      if (previous !== false) {
        previous = callback(item)
      }

      return previous
    })

    return this.newInstance(items)
  }

  /**
   * The tap method passes the collection to the given callback,
   * allowing you to "tap" into the collection at a specific point
   * and do something with the items while not affecting the collection itself.
   *
   * @param {Function} callback
   * @return {this}
   */
  tap(callback: (collection: Collection<Item>) => void): this {
    callback(this)

    return this
  }

  /**
   * The times method creates a new collection by invoking the callback a given amount of times.
   *
   * @param {number} times
   * @param {Function} callback
   * @return {Collection}
   */
  times<T extends Item>(
    times: number,
    callback: (time: number) => T
  ): Collection<T> {
    for (let iterator = 1; iterator <= times; iterator += 1) {
      this.items.push(callback(iterator))
    }

    return this as Collection<T>
  }

  /**
   * The toArray method converts the collection into a standard array.
   *
   * @return {Object[]}
   */
  toArray(): Item[] {
    return clone(this.items)
  }

  /**
   * The toJson method converts the collection into JSON string.
   *
   * @return {string}
   */
  toJson(): string {
    return JSON.stringify(this)
  }

  /**
   * The transform method iterates over the collection and calls the given callback with each item in the collection.
   * The items in the collection will be replaced by the values returned by the callback.
   */
  transform<T extends ItemData>(fn: (item: Item) => T): Collection<T> {
    this.items = this.items.map(fn) as this
    return this as Collection<T>
  }

  /**
   * The unique method returns all of the unique items in the collection.
   *
   * @param {string|string[]|Function} key
   * @return {Collection}
   */
  unique<K extends KeyVariadic>(
    key: keyof Item | K | ((item: Item) => Key)
  ): Collection<Item> {
    const collection = []
    const usedKeys: Key[] = []

    for (
      let iterator = 0, { length } = this.items;
      iterator < length;
      iterator += 1
    ) {
      let uniqueKey: Key

      if (isFunction(key)) {
        uniqueKey = key(this.items[iterator])
      } else {
        uniqueKey = getProp(this.items[iterator], key as KeyVariadic) as Key
      }

      if (usedKeys.indexOf(uniqueKey) === -1) {
        collection.push(this.items[iterator])
        usedKeys.push(uniqueKey)
      }
    }

    return this.newInstance(collection)
  }

  /**
   * The unless method will execute the given callback when the first argument given to the method evaluates to false.
   *
   * @param {unknown} value
   * @param {Function} callback
   * @param {Function} [defaultCallback]
   */
  unless<V>(
    value: V,
    callback: (collection: this, value: boolean) => void,
    defaultCallback?: (collection: this, value: boolean) => void
  ): this {
    return this.when(!value, callback, defaultCallback)
  }

  /**
   * Alias for the [whenNotEmpty()]{@link Collection#whenNotEmpty} method.
   *
   * @param {Function} callback
   * @param {Function} [defaultCallback]
   * @return {this}
   */
  unlessEmpty(
    callback: (collection: this, value: boolean) => void,
    defaultCallback?: (collection: this, value: boolean) => void
  ): this {
    return this.whenNotEmpty(callback, defaultCallback)
  }

  /**
   * Alias for the [whenEmpty()]{@link Collection#whenEmpty} method.
   *
   * @param {Function} callback
   * @param {Function} [defaultCallback]
   * @return {this}
   */
  unlessNotEmpty(
    callback: (collection: this, value: boolean) => void,
    defaultCallback?: (collection: this, value: boolean) => void
  ): this {
    return this.whenEmpty(callback, defaultCallback)
  }

  /**
   * The unwrap method will unwrap the given collection.
   *
   * @param {Object[]|Collection} value
   * @return {Object[]}
   */
  unwrap<T extends ItemData>(value: T[] | Collection<T>): T[] {
    if (value instanceof this.constructor) {
      return (value as Collection<T>).toArray()
    }

    return value
  }

  /**
   * The when method will execute the given callback when the first argument given to the method evaluates to true.
   *
   * @param {unknown} value
   * @param {Function} callback
   * @param {Function} [defaultCallback]
   * @return {this}
   */
  when<V>(
    value: V,
    callback: (collection: this, value: V) => void,
    defaultCallback?: (collection: this, value: V) => void
  ): this {
    if (value) {
      callback(this, value)
    } else if (defaultCallback) {
      defaultCallback(this, value)
    }

    return this
  }

  /**
   * The whenEmpty method will execute the given callback when the collection is empty.
   *
   * @param {Function} callback
   * @param {Function} [defaultCallback]
   * @return {this}
   */
  whenEmpty(
    callback: (collection: this, value: boolean) => void,
    defaultCallback?: (collection: this, value: boolean) => void
  ): this {
    return this.when(this.isEmpty(), callback, defaultCallback)
  }

  /**
   * The whenNotEmpty method will execute the given callback when the collection is not empty.
   *
   * @param {Function} callback
   * @param {Function} [defaultCallback]
   * @return {this}
   */
  whenNotEmpty(
    callback: (collection: this, value: boolean) => void,
    defaultCallback?: (collection: this, value: boolean) => void
  ): this {
    return this.when(this.isNotEmpty(), callback, defaultCallback)
  }

  public where<K extends KeyVariadic, V extends unknown>(
    key: keyof Item | K,
    value?: V
  ): Collection<Item>
  public where<K extends KeyVariadic, V extends unknown>(
    key: keyof Item | K,
    operator: Operator,
    value: V
  ): Collection<Item>

  /**
   * The where method filters the collection by a given key / value pair.
   *
   * @param {string} key
   * @param {string|*} [operator]
   * @param {*} [value]
   * @return {Collection}
   */
  public where<V extends unknown, K extends KeyVariadic>(
    key: keyof Item | K,
    operator?: V | Operator,
    value?: V
  ): Collection<Item> {
    let comparisonOperator = operator
    let comparisonValue = value

    const items = this.items

    if (operator === undefined || operator === true) {
      return this.newInstance(
        items.filter((item) => getProp(item, key as KeyVariadic))
      )
    }

    if (operator === false) {
      return this.newInstance(
        items.filter((item) => !getProp(item, key as KeyVariadic))
      )
    }

    if (value === undefined) {
      comparisonValue = operator as V
      comparisonOperator = '==='
    }

    const collection = items.filter((item) => {
      switch (comparisonOperator) {
        case '==':
          return getProp(item, key as KeyVariadic) == comparisonValue

        default:
        case '===':
          return getProp(item, key as KeyVariadic) === comparisonValue

        case '!=':
        case '<>':
          return getProp(item, key as KeyVariadic) != comparisonValue

        case '!==':
          return getProp(item, key as KeyVariadic) !== comparisonValue

        case '<':
          return (
            (getProp(item, key as KeyVariadic) as never) <
            (comparisonValue as never)
          )

        case '<=':
          return (
            (getProp(item, key as KeyVariadic) as never) <=
            (comparisonValue as never)
          )

        case '>':
          return (
            (getProp(item, key as KeyVariadic) as never) >
            (comparisonValue as never)
          )

        case '>=':
          return (
            (getProp(item, key as KeyVariadic) as never) >=
            (comparisonValue as never)
          )
      }
    })

    return this.newInstance(collection)
  }

  /**
   * The whereIn method filters the collection by a given key / value contained within the given array.
   *
   * @param {string|string[]} key
   * @param {unknown[]} values
   * @return {Collection}
   */
  whereIn<K extends KeyVariadic, V>(
    key: keyof Item | K,
    values: V[]
  ): Collection<Item> {
    const collection = this.items.filter(
      (item) => values.indexOf(getProp(item, key as KeyVariadic) as V) !== -1
    )

    return this.newInstance(collection)
  }

  /**
   * The whereNotIn method filters the collection by a given key / value not contained within the given array.
   *
   * @param {string|string[]} key
   * @param {unknown[]} values
   * @return {Collection}
   */
  whereNotIn<K extends KeyVariadic, V>(
    key: keyof Item | K,
    values: V[]
  ): Collection<Item> {
    const collection = this.items.filter(
      (item) => values.indexOf(getProp(item, key as KeyVariadic) as V) === -1
    )

    return this.newInstance(collection)
  }

  /**
   * Creates a new instance of the Collection.
   *
   * @param {...*} collection
   * @return {Collection}
   */
  protected newInstance(...collection: Item[] | [Item[]]): Collection<Item> {
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
