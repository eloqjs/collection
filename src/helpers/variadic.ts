/**
 * Variadic helper function.
 *
 * @param {unknown[]} args
 * @param {number} length
 * @return {*}
 */
function variadic<T>(args: T[] | [T[]], length: number = args.length): T[] {
  if (Array.isArray(args[0]) && args.length === length) {
    return args[0]
  }

  return args as T[]
}

export default variadic
