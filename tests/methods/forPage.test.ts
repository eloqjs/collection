import { collect } from '../../src'

describe('forPage()', () => {
  it('should return a collection containing the items that would be present on a given page number', () => {
    const products = [
      { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
      { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
      {
        id: 5,
        product: 'Monitor',
        price: 200,
        manufacturer: 'Herman Miller'
      },
      { id: 6, product: 'Mouse', price: 50, manufacturer: 'IKEA' },
      { id: 7, product: 'Keyboard', price: 300, manufacturer: 'IKEA' },
      {
        id: 8,
        product: 'Notebook',
        price: 350,
        manufacturer: 'Herman Miller'
      },
      { id: 9, product: 'Door', price: 100, manufacturer: 'IKEA' }
    ]
    const collection = collect(products)

    const forPage1 = collection.forPage(1, 3)
    expect(forPage1).toEqual([
      { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])

    const forPage2 = collection.forPage(2, 3)
    expect(forPage2).toEqual([
      { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
      {
        id: 5,
        product: 'Monitor',
        price: 200,
        manufacturer: 'Herman Miller'
      },
      { id: 6, product: 'Mouse', price: 50, manufacturer: 'IKEA' }
    ])

    const forPage3 = collection.forPage(3, 3)
    expect(forPage3).toEqual([
      { id: 7, product: 'Keyboard', price: 300, manufacturer: 'IKEA' },
      {
        id: 8,
        product: 'Notebook',
        price: 350,
        manufacturer: 'Herman Miller'
      },
      { id: 9, product: 'Door', price: 100, manufacturer: 'IKEA' }
    ])

    expect(collection).toEqual(products)
  })
})
