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
