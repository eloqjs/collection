import { collect } from '../../src'

describe('each()', () => {
  it('should iterate over the collection', () => {
    let sum = 0
    const products = [
      { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
      { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
      { id: 5, product: 'Bed', price: 200, manufacturer: 'Herman Miller' }
    ]
    const collection = collect(products)

    const each = collection.each((item) => {
      sum += item.price
    })

    expect(each).toEqual(products)
    expect(sum).toEqual(800)
    expect(collection).toEqual(products)

    let sum2 = 0

    const summed = collection.each((item) => {
      if (item.price > 150) {
        return
      }

      sum2 += item.price
    })

    expect(summed).toEqual(products)
    expect(sum2).toEqual(400)
  })

  it('should stop iterating, when returning false', () => {
    const products = [
      { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
      { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
      { id: 5, product: 'Bed', price: 200, manufacturer: 'Herman Miller' }
    ]
    const collection = collect(products)

    const result: unknown[] = []

    collection.each((item, key) => {
      if (item.price === 150) {
        return false
      }

      result[key] = item
    })

    expect(result).toEqual([
      { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' }
    ])
  })

  it('should not modify the collection', () => {
    const products = [
      { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
      { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
      { id: 5, product: 'Bed', price: 200, manufacturer: 'Herman Miller' }
    ]
    const collection = collect(products)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mapped = collection.each((item) => item.price * 2)

    expect(collection).toEqual(products)
    expect(mapped).toEqual(collection)
  })
})
