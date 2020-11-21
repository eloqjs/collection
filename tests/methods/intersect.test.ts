import { collect } from '../../src'

describe('intersect()', () => {
  it('should return the matching values from collection', () => {
    const products1 = [
      { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
      { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
      { id: 5, product: 'Bed', price: 200, manufacturer: 'Herman Miller' }
    ]
    const products2 = [
      { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
      { id: 9, product: 'Door', price: 100, manufacturer: 'IKEA' }
    ]
    const collection1 = collect(products1)
    const collection2 = collect(products2)
    const intersect = collection1.intersect(collection2)

    expect(intersect).toEqual([
      { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
    expect(collection1).toEqual(products1)
  })
})
