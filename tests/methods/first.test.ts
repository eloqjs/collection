import { collect } from '../../src'

describe('first()', () => {
  const products = [
    { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
    { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
    { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
    { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
    { id: 5, product: 'Bed', price: 200, manufacturer: 'Herman Miller' }
  ]

  it('should return the first item from the collection', () => {
    const collection = collect(products)
    const first = collection.first()

    expect(first).toEqual(products[0])
    expect(collection).toEqual(products)
  })

  it('should return null when no matches', () => {
    const collection = collect([])
    const first = collection.first()

    expect(first).toBeNull()
  })

  it('should accept a callback', () => {
    const collection = collect(products)
    const first = collection.first((item) => item.price < 150)

    expect(first).toEqual(products[1])
    expect(collection).toEqual(products)
  })

  it('should return null when no matches on callback', () => {
    const collection = collect(products)
    const first = collection.first((item) => item.price > 200)

    expect(first).toBeNull()
  })
})
