import { collect } from '../../src'

describe('firstWhere()', () => {
  const products = [
    { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
    { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
    { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
    { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
    { id: 5, product: 'Bed', price: 200, manufacturer: 'Herman Miller' }
  ]

  it('should return the first item where it matches', () => {
    const collection = collect(products)
    const first = collection.firstWhere('manufacturer', 'IKEA') as {
      id: number
      product: string
      price: number
      manufacturer: string
    }

    expect(first.product).toEqual('Desk')
  })

  it('should return null when no matches', () => {
    const collection = collect(products)

    expect(collection.firstWhere('manufacturer', 'xoxo')).toBeNull()
  })

  it('should be possible to pass an operator', () => {
    const collection = collect(products)
    const first = collection.firstWhere('manufacturer', '!==', 'IKEA') as {
      id: number
      product: string
      price: number
      manufacturer: string
    }

    expect(first.product).toEqual('Chair')
  })
})
