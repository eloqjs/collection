import { collect } from '../../src'

describe('avg()', () => {
  const products = [
    { name: 'Chair', price: 600 },
    { name: 'Desk', price: 900 },
    { name: 'Lamp', price: 150 }
  ]

  it('should return the average value of collection values by key', () => {
    const collection = collect(products)
    const avg = collection.avg('price')
    expect(avg).toBe(550)
    expect(collection).toEqual(products)
  })
})
