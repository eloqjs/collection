import { collect } from '../../src'

describe('take()', () => {
  const data = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 }
  ]

  it('should return a new collection with the specified number of items', () => {
    const collection = collect(data)
    const chunk = collection.take(3)

    expect(chunk).toEqual([{ id: 0 }, { id: 1 }, { id: 2 }])
    expect(collection).toEqual(data)
  })

  it('should take from the end of the collection when passed a negative integer', () => {
    const collection = collect(data)
    const chunk = collection.take(-2)

    expect(chunk).toEqual([{ id: 4 }, { id: 5 }])
    expect(collection).toEqual(data)
  })
})
