/**
 * Clone an array.
 *
 * @param items
 * @return {[*]}
 */
function clone<T extends unknown[]>(items: T): T {
  return [...items] as T
}

export default clone
