import { collect } from '../../src'

describe('fresh()', () => {
  it('should return a fresh item instance for all the items.', () => {
    const products = [
      { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
      { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
      { id: 5, product: 'Bed', price: 200, manufacturer: 'Herman Miller' }
    ]

    const collection = collect(products)

    expect(collection.fresh()).toEqual(products)
  })

  it('should return itself when collection is empty', () => {
    const collection = collect()

    expect(collection.fresh()).toEqual(collection)
  })
})
