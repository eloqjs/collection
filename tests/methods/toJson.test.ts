import { collect } from '../../src'

describe('toJson()', () => {
  const data = [
    { name: 'Desk', price: 200 },
    { name: 'Chair', price: 100 },
    { name: 'Bookcase', price: 150 }
  ]

  it('should convert the collection into JSON string', () => {
    const collection = collect(data)

    expect(collection.toJson()).toEqual(
      '[{"name":"Desk","price":200},{"name":"Chair","price":100},{"name":"Bookcase","price":150}]'
    )
  })
})
