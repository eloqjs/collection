import { collect } from '../../src'

describe('get()', () => {
  const data = [{ id: 1 }, { id: 2 }]
  const collection = collect(data)

  it('should return the item at a given index', () => {
    expect(collection.get(1)).toEqual({ id: 2 })
    expect(collection).toEqual(data)
  })

  it('should return null when the index does not exist', () => {
    expect(collection.get(2)).toBeNull()
    expect(collection).toEqual(data)
  })
})
