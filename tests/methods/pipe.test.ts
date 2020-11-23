import { collect } from '../../src'

describe('pipe()', () => {
  it('should pass the collection to the given callback and return the result', () => {
    const collection = collect([{ value: 1 }, { value: 2 }, { value: 3 }])

    const piped = collection.pipe((c) => c.sum('value'))

    expect(piped).toEqual(6)
  })

  it('should not modify the original collection', () => {
    const data = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 }
    ]
    const collection = collect(data)

    const piped = collection.pipe((c) => c.partition((item) => item.id < 3))

    expect(piped).toEqual([
      collect([{ id: 1 }, { id: 2 }]),
      collect([{ id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }])
    ])

    expect(collection).toEqual(data)
  })
})
