import { collect, Collection } from '../../src'

describe('toArray()', () => {
  it('should convert the collection into a standard array', () => {
    const data = [
      { name: 'Desk', price: 200 },
      { name: 'Chair', price: 100 },
      { name: 'Bookcase', price: 150 }
    ]
    const collection = collect(data)
    const array = collection.toArray()

    expect(array).toEqual(data)
    expect(array).toBeInstanceOf(Array)
    expect(array).not.toBeInstanceOf(Collection)
  })
})
