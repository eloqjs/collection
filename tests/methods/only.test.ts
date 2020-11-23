import { collect } from '../../src'

describe('only()', () => {
  it('should filter the collection by primary key / value contained within the given array', () => {
    const data = [
      { id: 1, product: 'Desk', price: 200 },
      { id: 2, product: 'Chair', price: 100 },
      { id: 3, product: 'Bookcase', price: 150 },
      { id: 4, product: 'Door', price: 100 }
    ]

    const collection = collect(data)

    const filtered = collection.only([2, 4])

    expect(filtered).toEqual([
      { id: 2, product: 'Chair', price: 100 },
      { id: 4, product: 'Door', price: 100 }
    ])

    expect(collection).toEqual(data)
  })
})
