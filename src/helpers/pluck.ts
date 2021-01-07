import type { ItemData, Key, Obj } from '../types'
import getProp from './getProp'
import { isArray, isObject } from './is'

/**
 * Build key path map.
 *
 * @param {Object} items
 * @return {[]|Object}
 */
export function buildKeyPathMap(items: Obj<unknown>[]): Obj<unknown> {
  const keyPaths: Obj<unknown> = {}

  items.forEach((item, index) => {
    function buildKeyPath(val: unknown, keyPath: string | number) {
      if (isObject(val)) {
        Object.keys(val).forEach((prop) => {
          buildKeyPath(val[prop], `${keyPath}.${prop}`)
        })
      } else if (isArray(val)) {
        val.forEach((v, i) => {
          buildKeyPath(v, `${keyPath}.${i}`)
        })
      }

      keyPaths[keyPath] = val
    }

    buildKeyPath(item, index)
  })

  return keyPaths
}

/**
 * Match key path map.
 *
 * @param {string} key
 * @param {[]|Object} pathMap
 * @return {[]}
 */
export function matches<K extends Key>(key: K, pathMap: Obj<unknown>): K[] {
  const matches: K[] = []
  const regex = new RegExp(`0.${key}`, 'g')
  const numberOfLevels = `0.${key}`.split('.').length

  Object.keys(pathMap).forEach((k) => {
    const matchingKey = k.match(regex)

    if (matchingKey) {
      const match = matchingKey[0]

      if (match.split('.').length === numberOfLevels) {
        matches.push(pathMap[match] as K)
      }
    }
  })

  return matches
}

/**
 * Get keys and values matches from KeyPath.
 *
 * @param {Object[]} items
 * @param {string} value
 * @param {string} [key]
 * @return {[string[], string[]]}
 */
export function getMatches<Item extends ItemData, V extends Key, K extends Key>(
  items: Item[],
  value: keyof Item | V,
  key?: keyof Item | K
): [K[], V[]] {
  const keyPathMap = buildKeyPathMap(items)
  const keyMatches: K[] = key ? [...matches(key as K, keyPathMap)] : []
  const valueMatches: V[] = [...matches(value as V, keyPathMap)]

  return [keyMatches, valueMatches]
}

/**
 * Get dictionary from matches.
 *
 * @param {Object[]} items
 * @param {string[]} keys
 * @param {string[]} values
 * @return {Object}
 */
export function getDictionaryFromMatches<
  Item extends ItemData,
  K extends Key,
  V
>(items: Item[], keys: K[], values: V[]): Obj<V[]> {
  const collection: Obj<V[]> = {}

  items.forEach((item, index) => {
    const key: Key = keys[index] || ''
    collection[key] = values
  })

  return collection
}

/**
 * Get dictionary from key.
 *
 * @param {Object[]} items
 * @param {string} value
 * @param {string} key
 * @return {Object}
 */
export function getDictionaryFromKey<
  Item extends ItemData,
  V extends Key,
  K extends Key
>(items: Item[], value: keyof Item | V, key: keyof Item | K): Obj<unknown> {
  const collection: Obj<unknown> = {}

  items.forEach((item) => {
    const _value = getProp(item, value as V)
    const _key = (item[key] as Key) || ''
    collection[_key] = _value ?? null
  })

  return collection
}
