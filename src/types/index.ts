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
export type Key = string | number
export type KeyOrArray = Key | Key[]
