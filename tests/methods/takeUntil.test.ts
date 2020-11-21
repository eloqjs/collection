import { collect } from '../../src'

describe('takeUntil()', () => {
  const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]

  it('should take values', () => {
    const collection = collect(data)

    expect(collection.takeUntil(data[2])).toEqual([{ id: 1 }, { id: 2 }])

    expect(collection.takeUntil(data[0])).toEqual([])
  })

  it('should accept a callback', () => {
    const collection = collect(data)

    const subset = collection.takeUntil((item) => item.id >= 3)

    expect(subset).toEqual([{ id: 1 }, { id: 2 }])
  })
})
