import {
  buildKeyPathMap,
  clone,
  getDefaultValue,
  getProp,
  getValueFromItem,
  isArray,
  isFunction,
  isObject,
  isString,
  matches,
  variadic
} from './helpers'
import type {
  ClassCollection,
  ClassConstructor,
  Constructor,
  DefaultValue,
  ItemData,
  ItemOrDefault,
  Key,
  KeyVariadic,
  Operator
} from './types'

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

  public static primaryKey<T extends ItemData>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    collection
  }: {
    collection: Collection<T>
  }): string {
    return 'id'
  }

  public static newQuery<T extends ItemData>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    collection,
    item
  }: {
    collection: Collection<T>
    item: T
  }): T {
    return item
  }

  public static getFresh<T extends ItemData>({
    collection,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    include
  }: {
    collection: Collection<T>
    include: string[]
  }): T[] | Collection<T> {
    return collection.items
  }

  /**
   * Alias for the avg() method.
   *
   * @param {string|string[]} key
   * @return {number}
   */
  public average<K extends KeyVariadic>(key: keyof Item | K): number {
    return this.avg(key)
  }

  /**
   * The avg method returns the average of all items in the collection.
   *
   * @param {string|string[]} key
   * @return {number}
   */
  public avg<K extends KeyVariadic>(key: keyof Item | K): number {
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
      const collection = this.newInstance<Item>(items)

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
    const arrayOfCollections = variadic(array, 1)

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

    return this.newInstance<Item>(collection)
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
  public contains<V, K extends KeyVariadic>(
    key: keyof Item | K | Item | ((item: Item, index: number) => unknown),
    value?: V
  ): boolean {
    if (isFunction(key)) {
      return this.items.filter((item, index) => key(item, index)).length > 0
    }

    if (isObject(key)) {
      return this.findIndexBy(key as Item) !== -1
    }

    if (value) {
      return this.findIndexBy(value, key as KeyVariadic) !== -1
    }

    return false
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
   * @param {Collection} collection
   * @return {Collection}
   */
  public diff(collection: Collection<Item>): Collection<Item> {
    const dictionary = this.getDictionary(collection)
    const _collection = this.items.filter(
      (item) => !dictionary[this.getPrimaryKey(item)]
    )

    return this.newInstance<Item>(_collection)
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
    this.items.every((item, index) => {
      return callback(this.items[index], index, this.items) !== false
    })

    return this
  }

  /**
   * The except method returns all of the items that do not have the given primary keys.
   *
   * @param {string[]|number[]} keys
   * @return {Collection}
   */
  public except(keys: string[] | number[]): Collection<Item> {
    return this.whereNotIn(this.primaryKey(), keys)
  }

  /**
   * The find method finds an item that has a given primary key.
   * If key is an item, find will attempt to return an item matching the primary key.
   * If key is an array of keys, find will return all items which match the keys
   * using [whereIn()]{@link Collection#whereIn}
   *
   * @param {string[]|number[]} keys
   * @return {Collection|this}
   */
  public find(keys: string[] | number[]): Collection<Item> | this

  /**
   * The find method finds an item that has a given primary key.
   * If key is an item, find will attempt to return an item matching the primary key.
   * If key is an array of keys, find will return all items which match the keys
   * using [whereIn()]{@link Collection#whereIn}
   *
   * @param {string|number|Object} key
   * @param {unknown} [defaultValue]
   * @return {Object|null}
   */
  public find<D = null>(
    key: string | number | Item,
    defaultValue?: DefaultValue<D>
  ): ItemOrDefault<Item, D>

  public find<S extends Item>(
    predicate: (
      this: void,
      value: Item,
      index: number,
      obj: Item[]
    ) => value is S,
    thisArg?: unknown
  ): S | undefined

  public find(
    predicate: (value: Item, index: number, obj: Item[]) => unknown,
    thisArg?: unknown
  ): Item | undefined

  /**
   * The find method finds an item that has a given primary key.
   * If key is an item, find will attempt to return an item matching the primary key.
   * If key is an array of keys, find will return all items which match the keys
   * using [whereIn()]{@link Collection#whereIn}
   *
   * @param {string|number|string[]|number[]|Object} keyOrPredicate
   * @param {unknown} [defaultValueOrThisArg]
   * @return {Object|Collection|this|null}
   */
  public find<D = null>(
    keyOrPredicate:
      | string
      | number
      | string[]
      | number[]
      | Item
      | ((value: Item, index: number, obj: Item[]) => unknown),
    defaultValueOrThisArg?: DefaultValue<D>
  ): ItemOrDefault<Item, D> | Collection<Item> | this | undefined {
    if (isFunction(keyOrPredicate)) {
      return super.find(keyOrPredicate, defaultValueOrThisArg)
    }

    const defaultValue = defaultValueOrThisArg || null

    if (isArray(keyOrPredicate)) {
      if (this.isEmpty()) {
        return this
      }

      return this.whereIn(this.primaryKey(), keyOrPredicate)
    }

    return (
      this.first((item) => this.compareItems(item, keyOrPredicate)) ||
      getDefaultValue(defaultValue)
    )
  }

  /**
   * The findIndexBy method finds an index based on value of the given key, and returns -1 when not found.
   * The primary key will be used by default.
   *
   * @param {unknown} value
   * @param {string|string[]} [key=primaryKey]
   * @return {number}
   */
  public findIndexBy<V>(
    value: Item | V,
    key: KeyVariadic = this.primaryKey()
  ): number {
    return this.findIndex((item) => {
      const _value = isObject(value)
        ? getProp(value as Item, key)
        : (value as V)

      return getProp(item, key) === _value
    })
  }

  /**
   * The first method returns the first element in the collection that passes a given truth test.
   *
   * @param {Function} callback
   * @param {unknown} defaultValue
   * @return {Object}
   */
  public first<D = null>(
    callback: ((item: Item) => boolean) | null = null,
    defaultValue: DefaultValue<D> = null
  ): ItemOrDefault<Item, D> {
    if (isFunction(callback)) {
      for (const item of this.items) {
        if (callback(item)) {
          return item
        }
      }
    } else if (this.isNotEmpty()) {
      return this.items[0]
    }

    return getDefaultValue(defaultValue)
  }

  public firstWhere<V extends unknown, K extends Key>(
    key: keyof Item | K,
    value?: V
  ): Item | null

  public firstWhere<V extends unknown, K extends Key>(
    key: keyof Item | K,
    operator: Operator,
    value: V
  ): Item | null

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
  ): Item | null {
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
  public forPage(page: number, chunk: number): Collection<Item> {
    const collection = this.items.slice(page * chunk - chunk, page * chunk)

    return this.newInstance<Item>(collection)
  }

  /**
   * The forget method removes an item from the collection by its key.
   *
   * @param {number} index
   * @return {this}
   */
  public forget(index: number): this {
    this.items.splice(index, 1)

    return this
  }

  /**
   * The fresh method reloads a fresh item instance from the database for all the items.
   *
   * @param {...*} include
   * @return this
   */
  public fresh(...include: string[] | [string[]]): this {
    const _include = variadic(include)

    if (this.isEmpty()) {
      return this
    }

    const freshItems = this.wrap<Item>(
      Collection.getFresh({ collection: this, include: _include })
    ).getDictionary()

    return this.map((item) => {
      const freshItem = freshItems[this.getPrimaryKey(item)]

      if (!!item[this.primaryKey()] && !!freshItem) {
        return freshItem
      }
    }) as this
  }

  /**
   * The get method returns the item at a given key. If the key does not exist, null is returned.
   *
   * @param {number} index
   * @param {unknown} defaultValue
   * @return {Object|null}
   */
  public get<D = null>(
    index: number,
    defaultValue: DefaultValue<D> = null
  ): ItemOrDefault<Item, D> {
    if (this.items[index] !== undefined) {
      return this.items[index]
    }

    return getDefaultValue(defaultValue)
  }

  /**
   * The getDictionary method returns a dictionary keyed by primary keys.
   *
   * @param {Collection} [collection]
   * @return {Object}
   */
  public getDictionary(collection?: Collection<Item>): Record<string, Item> {
    const items = collection || this.items
    const dictionary = {}

    for (const item of items) {
      dictionary[this.getPrimaryKey(item)] = item
    }

    return dictionary
  }

  /**
   * The groupBy method groups the collection's items by a given key.
   *
   * @param {Function|string} key
   * @return {Object}
   */
  public groupBy<K extends KeyVariadic>(
    key: keyof Item | K | ((item: Item, index: number) => Key)
  ): Record<string, unknown> {
    const collection = {}

    this.items.forEach((item, index) => {
      const resolvedKey: Key = (getValueFromItem(item, key, index) as Key) ?? ''

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
   * @param {Collection} collection
   * @return {Collection}
   */
  public intersect(collection: Collection<Item>): Collection<Item> {
    const dictionary = this.getDictionary(collection)
    const _collection = this.items.filter(
      (item) => !!dictionary[this.getPrimaryKey(item)]
    )

    return this.newInstance<Item>(_collection)
  }

  /**
   * The implode method joins the items in a collection.
   *
   * @param {string} key - The key of the attributes you wish to join.
   * @param {string} glue - The "glue" string you wish to place between the values.
   * @return {string}
   */
  public implode<K extends Key>(key: keyof Item | K, glue: string): string {
    return this.pluck(key).join(glue)
  }

  /**
   * The isEmpty method returns true if the collection is empty; otherwise, false is returned.
   *
   * @return {boolean}
   */
  public isEmpty(): boolean {
    return !this.items.length
  }

  /**
   * The isNotEmpty method returns true if the collection is not empty; otherwise, false is returned.
   *
   * @return {boolean}
   */
  public isNotEmpty(): boolean {
    return !this.isEmpty()
  }

  /**
   * The keyBy method keys the collection by the given key.
   * If multiple items have the same key, only the last one will appear in the new collection.
   *
   * @param {string|string[]|Function} key
   * @return {Object}
   */
  public keyBy<K extends KeyVariadic>(
    key: keyof Item | K | ((item: Item) => Key)
  ): Record<Key, Item> {
    const collection: Record<Key, Item> = {}

    this.items.forEach((item) => {
      const _key: Key = (getValueFromItem(item, key) as Key) || ''
      collection[_key] = item
    })

    return collection
  }

  /**
   * The last method returns the last element in the collection that passes a given truth test.
   *
   * @param {Function|null} callback
   * @param {unknown} defaultValue
   * @return {Object}
   */
  public last<D = null>(
    callback: ((item: Item) => boolean) | null = null,
    defaultValue: DefaultValue<D> = null
  ): ItemOrDefault<Item, D> {
    let items: Item[] = clone(this.items)

    if (isFunction(callback)) {
      items = items.filter(callback)
    }

    if (!items.length) {
      return getDefaultValue(defaultValue)
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
  public mapInto<T extends Item>(
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
  public mapToGroups(
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
  public mapWithKeys(
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
  public max<K extends KeyVariadic>(key: keyof Item | K): number {
    return Math.max(...(this.getValuesByKey(key) as number[]))
  }

  /**
   * The median method returns the [median value]{@link https://en.wikipedia.org/wiki/Median} of a given key.
   *
   * @param {string|string[]} key
   * @return {number}
   */
  public median<K extends KeyVariadic>(key: keyof Item | K): number {
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
  public min<K extends KeyVariadic>(key: keyof Item | K): number {
    return Math.min(...(this.getValuesByKey(key) as number[]))
  }

  /**
   * The mode method returns the [mode value]{@link https://en.wikipedia.org/wiki/Mode_(statistics)} of a given key.
   *
   * @param {string|string[]} key
   * @return {number}
   */
  public mode<K extends KeyVariadic>(key: keyof Item | K): number[] | null {
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
   * The modelKeys method returns an array of primary keys.
   *
   * @return {string[]|number[]}
   */
  public modelKeys(): (string | number)[] {
    return this.items.map((item) => this.getPrimaryKey(item))
  }

  /**
   * The nth method creates a new collection consisting of every n-th element.
   *
   * @param {number} step
   * @param {number} [offset]
   */
  public nth(step: number, offset?: number): Collection<Item> {
    const collection = this.items
      .slice(offset)
      .filter((item, index) => index % step === 0)

    return this.newInstance<Item>(collection)
  }

  /**
   * The only method returns all of the items that have the given primary keys.
   *
   * @param {string[]|number[]} keys
   * @return {Collection}
   */
  public only(keys: string[] | number[]): Collection<Item> {
    return this.whereIn(this.primaryKey(), keys)
  }

  /**
   * The partition method may be combined with destructuring to separate elements
   * that pass a given truth test from those that do not.
   *
   * @param {Function} callback
   * @return {[Collection, Collection]}
   */
  public partition(
    callback: (item: Item) => boolean
  ): [Collection<Item>, Collection<Item>] {
    const arrays: [Collection<Item>, Collection<Item>] = [
      this.newInstance<Item>([]),
      this.newInstance<Item>([])
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
  public pipe<U>(callback: (collection: this) => U): U {
    return callback(this)
  }

  /**
   * The pipeInto method creates a new instance of the given class and passes the collection into the constructor.
   *
   * @param {Function} classConstructor
   * @return {Function}
   */
  public pipeInto<T>(classConstructor: ClassCollection<T, this>): T {
    return new classConstructor(this)
  }

  public pluck<V extends Key>(value: keyof Item | V): unknown[]

  public pluck<V extends Key, K extends Key>(
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
  public pluck<V extends Key, K extends Key>(
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
  public prepend(value: Item): this {
    this.items.unshift(value)

    return this
  }

  /**
   * The pull method removes and returns an item from the collection by its primary key.
   *
   * @param {string|number} primaryKey
   * @param {unknown} defaultValue
   * @return {Object|null}
   */
  public pull<D = null>(
    primaryKey: string | number,
    defaultValue: DefaultValue<D> = null
  ): ItemOrDefault<Item, D> {
    const item = this.find(primaryKey)

    if (item) {
      const index = this.findIndexBy(item as Item)

      if (index !== -1) {
        this.items.splice(index, 1)
      }
    }

    return item || getDefaultValue(defaultValue)
  }

  /**
   * The put method sets or overrides an item in the collection based on its primary key.
   *
   * @param {Object} item
   * @return {this}
   */
  public put(item: Item): this {
    const index = this.findIndexBy(item)

    if (index !== -1) {
      this.items.splice(index, 1, item)
    } else {
      this.items.push(item)
    }

    return this
  }

  public random(): Item | null

  public random(length: number): Collection<Item>

  /**
   * The random method returns a random item from the collection.
   *
   * @param {number} length
   * @return {Object|Collection|null}
   */
  public random(length?: number): Item | Collection<Item> | null {
    const collection = this.newInstance<Item>(clone(this.items)).shuffle()

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
  public reject(callback: (item: Item) => boolean): Collection<Item> {
    return this.newInstance<Item>(this.items).filter(
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
  public search(
    callback: (item: Item, index: number) => boolean
  ): number | false {
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
  public shuffle(): this {
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
  public skip(number: number): Collection<Item> {
    return this.newInstance<Item>(this.items.slice(number))
  }

  /**
   * The skipUntil method skips items until the given callback returns true and
   * then returns the remaining items in the collection.
   * You may also pass a simple value to the skipUntil method to skip all items until the given value is found.
   *
   * @param {Object|Function} value
   * @return {Collection}
   */
  public skipUntil(value: Item | ((item: Item) => boolean)): Collection<Item> {
    const items = this.filterUntil(value, true, false)

    return this.newInstance<Item>(items)
  }

  /**
   * The skipWhile method skips items while the given callback returns true and
   * then returns the remaining items in the collection
   * You may also pass a simple value to the skipWhile.
   *
   * @param {Object|Function} value
   * @return {Collection}
   */
  public skipWhile(value: Item | ((item: Item) => boolean)): Collection<Item> {
    const items = this.filterUntil(value, true, true)

    return this.newInstance<Item>(items)
  }

  /**
   * The sortBy method sorts the collection by the given key.
   * The sorted collection keeps the original array keys.
   *
   * @param {string|string[]|Function} value
   * @return {Collection}
   */
  public sortBy<K extends KeyVariadic>(
    value: keyof Item | K | ((item: Item) => number)
  ): Collection<Item> {
    const collection = clone(this.items)

    collection.sort((a, b) => {
      const valueA = getValueFromItem(a, value) as number
      const valueB = getValueFromItem(b, value) as number

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

    return this.newInstance<Item>(collection)
  }

  /**
   * This method has the same signature as the sortBy method,
   * but will sort the collection in the opposite order.
   *
   * @param {string|string[]|Function} value
   * @return {Collection}
   */
  public sortByDesc<K extends KeyVariadic>(
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
  public split(numberOfGroups: number): Collection<Item>[] {
    const itemsPerGroup = Math.round(this.items.length / numberOfGroups)
    const collection = []

    for (let iterator = 0; iterator < numberOfGroups; iterator += 1) {
      collection.push(
        this.newInstance<Item>(this.items.splice(0, itemsPerGroup))
      )
    }

    return collection
  }

  /**
   * The sum method returns the sum of all items in the collection.
   *
   * @param {string|string[]|Function} key
   * @return {number}
   */
  public sum<K extends KeyVariadic>(
    key: keyof Item | K | ((item: Item) => string | number)
  ): number {
    let total = 0

    for (const item of this.items) {
      const value = getValueFromItem(item, key) as string | number
      total += isString(value) ? parseFloat(value) : value
    }

    return parseFloat(total.toPrecision(12))
  }

  /**
   * The take method returns a new collection with the specified number of items.
   * You may also pass a negative integer to take the specified amount of items from the end of the collection.
   *
   * @param {number} length
   */
  public take(length: number): Collection<Item> {
    if (length < 0) {
      return this.newInstance<Item>(this.items.slice(length))
    }

    return this.newInstance<Item>(this.items.slice(0, length))
  }

  /**
   * The takeUntil method returns items in the collection until the given callback returns true.
   * You may also pass a simple value to the takeUntil method to get the items until the given value is found.
   *
   * @param {Object|Function} value
   * @return {Collection}
   */
  public takeUntil(value: Item | ((item: Item) => boolean)): Collection<Item> {
    const items = this.filterUntil(value, false, true)

    return this.newInstance<Item>(items)
  }

  /**
   * The takeWhile method returns items in the collection until the given callback returns false.
   *
   * @param {Object|Function} value
   * @return {Collection}
   */
  public takeWhile(value: Item | ((item: Item) => boolean)): Collection<Item> {
    const items = this.filterUntil(value, false, false)

    return this.newInstance<Item>(items)
  }

  /**
   * The tap method passes the collection to the given callback,
   * allowing you to "tap" into the collection at a specific point
   * and do something with the items while not affecting the collection itself.
   *
   * @param {Function} callback
   * @return {this}
   */
  public tap(callback: (collection: Collection<Item>) => void): this {
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
  public times<T extends Item>(
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
  public toArray(): Item[] {
    return clone(this.items)
  }

  /**
   * The toJson method converts the collection into JSON string.
   *
   * @return {string}
   */
  public toJson(): string {
    return JSON.stringify(this)
  }

  /**
   * The toQuery method converts the collection into a Query Builder.
   *
   * @return {Object}
   */
  public toQuery(): Item {
    const item = this.first()

    if (!item) {
      throw new Error('Unable to create query for empty collection.')
    }

    const isMixed = (this.filter((_item) => {
      return !(_item instanceof item.constructor)
    }) as Collection<Item>).isNotEmpty()

    if (isMixed) {
      throw new Error('Unable to create query for collection with mixed types.')
    }

    return Collection.newQuery({ collection: this, item })
  }

  /**
   * The transform method iterates over the collection and calls the given callback with each item in the collection.
   * The items in the collection will be replaced by the values returned by the callback.
   */
  public transform<T extends ItemData>(fn: (item: Item) => T): Collection<T> {
    this.items = this.items.map(fn) as this
    return this as Collection<T>
  }

  /**
   * The unique method returns all of the unique items in the collection.
   *
   * @param {string|string[]|Function} [key]
   * @return {Collection}
   */
  public unique<K extends KeyVariadic>(
    key?: keyof Item | K | ((item: Item) => Key)
  ): Collection<Item> {
    if (key) {
      const collection: Item[] = []
      const usedKeys: Key[] = []

      this.items.forEach((item) => {
        const uniqueKey = getValueFromItem(item, key) as Key

        if (usedKeys.indexOf(uniqueKey) === -1) {
          collection.push(item)
          usedKeys.push(uniqueKey)
        }
      })

      return this.newInstance<Item>(collection)
    }

    return this.newInstance<Item>(Object.values(this.getDictionary()))
  }

  /**
   * The unless method will execute the given callback when the first argument given to the method evaluates to false.
   *
   * @param {unknown} value
   * @param {Function} callback
   * @param {Function} [defaultCallback]
   */
  public unless<V>(
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
  public unlessEmpty(
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
  public unlessNotEmpty(
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
  public unwrap<T extends ItemData>(value: T[] | Collection<T>): T[] {
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
  public when<V>(
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
  public whenEmpty(
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
  public whenNotEmpty(
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
      return this.newInstance<Item>(
        items.filter((item) => getProp(item, key as KeyVariadic))
      )
    }

    if (operator === false) {
      return this.newInstance<Item>(
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

    return this.newInstance<Item>(collection)
  }

  /**
   * The whereBetween method filters the collection within a given range.
   *
   * @param {string|string[]} key
   * @param {unknown[]} values
   * @return {Collection}
   */
  public whereBetween<K extends KeyVariadic>(
    key: keyof Item | K,
    values: unknown[]
  ): Collection<Item> {
    return this.where(key, '>=', values[0]).where(
      key,
      '<=',
      values[values.length - 1]
    )
  }

  /**
   * The whereIn method filters the collection by a given key / value contained within the given array.
   *
   * @param {string|string[]} key
   * @param {unknown[]} values
   * @return {Collection}
   */
  public whereIn<K extends KeyVariadic>(
    key: keyof Item | K,
    values: unknown[]
  ): Collection<Item> {
    const collection = this.items.filter(
      (item) => values.indexOf(getProp(item, key as KeyVariadic)) !== -1
    )

    return this.newInstance<Item>(collection)
  }

  /**
   * The whereNotBetween method filters the collection within a given range.
   *
   * @param {string|string[]} key
   * @param {unknown[]} values
   * @return {Collection}
   */
  public whereNotBetween<K extends KeyVariadic>(
    key: keyof Item | K,
    values: unknown[]
  ): Collection<Item> {
    const collection = this.filter(
      (item) =>
        (getProp(item, key as KeyVariadic) as never) < (values[0] as never) ||
        (getProp(item, key as KeyVariadic) as never) >
          (values[values.length - 1] as never)
    )
    return this.newInstance<Item>(collection)
  }

  /**
   * The whereNotIn method filters the collection by a given key / value not contained within the given array.
   *
   * @param {string|string[]} key
   * @param {unknown[]} values
   * @return {Collection}
   */
  public whereNotIn<K extends KeyVariadic>(
    key: keyof Item | K,
    values: unknown[]
  ): Collection<Item> {
    const collection = this.items.filter(
      (item) => values.indexOf(getProp(item, key as KeyVariadic)) === -1
    )

    return this.newInstance<Item>(collection)
  }

  /**
   * The whereNotNull method filters items where the given key is not null.
   *
   * @param {string|string[]} key
   * @return {Collection}
   */
  public whereNotNull<K extends KeyVariadic>(
    key: keyof Item | K
  ): Collection<Item> {
    return this.where(key, '!==', null)
  }

  /**
   * The whereNull method filters items where the given key is null.
   *
   * @param {string|string[]} key
   * @return {Collection}
   */
  public whereNull<K extends KeyVariadic>(
    key: keyof Item | K
  ): Collection<Item> {
    return this.where(key, '===', null)
  }

  /**
   * The wrap method will wrap the given value in a collection.
   *
   * @param {Object[]|Collection} collection
   * @return {Collection}
   */
  public wrap<T extends ItemData>(
    collection: T[] | Collection<T>
  ): Collection<T>

  /**
   * The wrap method will wrap the given value in a collection.
   *
   * @param {...Object[]} items
   * @return {Collection}
   */
  public wrap<T extends ItemData>(...items: T[]): Collection<T>

  /**
   * The wrap method will wrap the given value in a collection.
   *
   * @param {...Object[]|[Object[]]|[Collection]} collection
   * @return {Collection}
   */
  public wrap<T extends ItemData>(
    ...collection: T[] | [T[]] | [Collection<T>]
  ): Collection<T> {
    const _collection = variadic(collection)

    if (_collection instanceof this.constructor) {
      return _collection as Collection<T>
    }

    return this.newInstance<T>(_collection)
  }

  /**
   * Creates a new instance of the Collection.
   *
   * @param {...*} collection
   * @return {Collection}
   */
  protected newInstance<T extends ItemData>(
    ...collection: T[] | [T[]]
  ): Collection<T> {
    const items = variadic(collection)
    const instance = this.constructor as Constructor<Collection<T>>

    return new instance(items)
  }

  /**
   * Get the primary key for the item.
   *
   * @return {string}
   */
  protected primaryKey(): string {
    return Collection.primaryKey<Item>({ collection: this })
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

  /**
   * The getValuesByKey method returns an array of values of a given key.
   *
   * @param {string|string[]} key
   * @return {unknown[]}
   */
  private getValuesByKey<K>(key: keyof Item | K): unknown[] {
    const filtered = this.items.filter(
      (item) => getProp(item, key as KeyVariadic) !== undefined
    )

    return filtered.map((item) => getProp(item, key as KeyVariadic))
  }

  /**
   * The filterUntil method filters the items until callback respond with the value determined by response argument.
   *
   * @param {Object|Function} itemOrCallback
   * @param {boolean} response - Filter until callback respond with the determined value.
   * @param {boolean} negateCallback - Negate the callback response.
   * @return {Object[]}
   */
  private filterUntil(
    itemOrCallback: Item | ((item: Item) => boolean),
    response: boolean,
    negateCallback: boolean
  ): Collection<Item> {
    let previous: boolean | null = null

    const callback = isFunction(itemOrCallback)
      ? itemOrCallback
      : (item: Item) => this.compareItems(item, itemOrCallback)
    return this.items.filter((item) => {
      if (previous !== response) {
        previous = negateCallback ? !callback(item) : callback(item)
      }

      return previous
    }) as Collection<Item>
  }

  /**
   * The compareItems method compares the primary key of two items.
   *
   * @param {Object} item1
   * @param {Object} item2
   * @return {boolean}
   */
  private compareItems<V>(item1: Item, item2: Item | V) {
    return (
      this.getPrimaryKey(item1) ===
      (isObject(item2) ? this.getPrimaryKey(item2 as Item) : (item2 as V))
    )
  }
}
