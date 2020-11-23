import { collect } from '../../src'

describe('skipWhile()', () => {
  it('should skip all values before a given value appears', () => {
    const data = [
      { id: 1 },
      { id: 1 },
      { id: 2 },
      { id: 2 },
      { id: 3 },
      { id: 3 },
      { id: 4 },
      { id: 4 }
    ]
    const collection = collect(data)

    expect(collection.skipWhile({ id: 1 })).toEqual([
      { id: 2 },
      { id: 2 },
      { id: 3 },
      { id: 3 },
      { id: 4 },
      { id: 4 }
    ])
  })

  it('should accept a callback', () => {
    const collection = collect([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])

    const subset = collection.skipWhile((item) => item.id <= 3)

    expect(subset).toEqual([{ id: 4 }])
  })
})
