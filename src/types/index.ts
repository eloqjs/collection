export type Constructor<T> = new (...args: unknown[]) => T
export type ClassConstructor<T, Item> = {
  new (item: Item): T
}
export type ClassCollection<T, Collection> = {
  new (collection: Collection): T
}
export type Operator =
  | '==='
  | '=='
  | '!=='
  | '!='
  | '<>'
  | '>'
  | '<'
  | '>='
  | '<='
  | 'LIKE'
export type Key = string
export type KeyVariadic = Key | Key[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ItemData = Record<Key, any>
// eslint-disable-next-line @typescript-eslint/ban-types
export type ExtractFunction<T> = Extract<T, Function>
export type ItemOrDefault<Item extends ItemData = ItemData, D = null> =
  | Item
  | D
  | null
export type DefaultValue<D = null> = D | (() => D) | null
