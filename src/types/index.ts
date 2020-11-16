export type Constructor<T> = new (...args: unknown[]) => T
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
export type Key = string
export type KeyVariadic = Key | Key[]
// eslint-disable-next-line @typescript-eslint/ban-types
export type ExtractFunction<T> = Extract<T, Function>
