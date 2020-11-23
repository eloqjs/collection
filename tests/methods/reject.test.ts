import { collect } from '../../src'

describe('reject()', () => {
  const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]

  it('should filter the collection using the given callback. removing items that returns true in the callback', () => {
    const collection = collect(data)
    const filtered = collection.reject((item) => item.id > 2)

    expect(filtered).toEqual([{ id: 1 }, { id: 2 }])
    expect(collection).toEqual(data)
  })

  it('should not modify the collection', () => {
    const collection = collect([...data, { id: 5 }, { id: 6 }])
    const filtered = collection.reject((item) => item.id > 2)

    expect(filtered).toEqual([{ id: 1 }, { id: 2 }])
    expect(collection).toEqual([...data, { id: 5 }, { id: 6 }])
  })

  it('should do the exact opposite of filter', () => {
    const collection = collect(data)
    const filter = collection.filter((item) => item.id > 2)
    const reject = collection.reject((item) => item.id > 2)

    expect(filter).toEqual([{ id: 3 }, { id: 4 }])
    expect(reject).toEqual([{ id: 1 }, { id: 2 }])
  })
})
