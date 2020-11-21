import { collect } from '../../src'

describe('findIndexBy()', () => {
  const users = [
    { id: 1, name: 'Joe Doe' },
    { id: 2, name: 'John Doe' },
    { id: 3, name: 'Alex Doe' },
    { id: 4, name: 'Mary Doe' }
  ]
  const collection = collect(users)

  it("should find an index based on value of the item's key", () => {
    const user = { id: 2, name: 'John Doe' }
    expect(collection.findIndexBy(user, 'name')).toBe(1)
  })

  it("should find an index based on value of the item's primary key when key is not provided", () => {
    const user = { id: 4, name: 'Mary Doe' }
    expect(collection.findIndexBy(user)).toBe(3)
  })

  it('should find an index based on value of the given key', () => {
    expect(collection.findIndexBy('John Doe', 'name')).toBe(1)
  })

  it('should return -1 when index is not found', () => {
    const user = { id: 5, name: 'Johnny Doe' }
    expect(collection.findIndexBy(user)).toBe(-1)
  })
})
