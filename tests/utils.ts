const mocks = {}
let iterator = 0

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function hoax(
  // eslint-disable-next-line @typescript-eslint/ban-types
  obj: object,
  method: string,
  fn?: (...args: unknown[]) => unknown
) {
  iterator += 1

  const f = obj
  const id = iterator

  mocks[id] = {
    calls: [],
    original: obj[method]
  }

  // eslint-disable-next-line consistent-return
  f[method] = (...args: unknown[]) => {
    mocks[id].calls.push(args)

    if (fn) {
      return fn(args)
    }
  }

  return {
    calls: mocks[id].calls,
    reset: () => {
      f[method] = mocks[id].original
    }
  }
}
