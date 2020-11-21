import { collect } from '../../src'

describe('takeWhile()', () => {
  const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]

  it('should take values', () => {
    const collection = collect(data)

    expect(collection.takeWhile(data[0])).toEqual([{ id: 1 }])

    expect(collection.takeWhile(data[1])).toEqual([])
  })

  it('should accept a callback', () => {
    const collection = collect(data)

    const subset = collection.takeWhile((item) => item.id < 3)

    expect(subset).toEqual([{ id: 1 }, { id: 2 }])
  })
})
