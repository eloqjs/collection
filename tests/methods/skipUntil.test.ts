import { collect } from '../../src'

describe('skipUntil()', () => {
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

    expect(collection.skipUntil({ id: 3 })).toEqual([
      { id: 3 },
      { id: 3 },
      { id: 4 },
      { id: 4 }
    ])
    expect(collection.skipUntil({ id: 1 })).toEqual(data)
  })

  it('should accept a callback', () => {
    const collection = collect([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])

    const subset = collection.skipUntil((item) => item.id >= 3)

    expect(subset).toEqual([{ id: 3 }, { id: 4 }])
  })
})
