import { collect } from '../../src'

describe('search()', () => {
  const users = [
    { id: 1, name: 'Joe Doe' },
    { id: 2, name: 'John Doe' },
    { id: 3, name: 'Alex Doe' },
    { id: 4, name: 'Mary Doe' }
  ]
  const collection = collect(users)

  it("should search the collection for the value of the item's key, then return the item's index if found", () => {
    const user = { id: 2, name: 'John Doe' }
    expect(collection.search(user, 'name')).toBe(1)
  })

  it("should search the collection for the value of the item's primary key when key is not provided, then return the item's index if found", () => {
    const user = { id: 4, name: 'Mary Doe' }
    expect(collection.search(user)).toBe(3)
    expect(collection.search(4)).toBe(3)
  })

  it("should search the collection for the value of the given key, then return the item's index if found", () => {
    expect(collection.search('John Doe', 'name')).toBe(1)
  })

  it("should accept a callback and search for the first item that passes the truth test, then return the item's index if found", () => {
    expect(collection.search((item) => item.id > 1)).toEqual(1)
  })

  it('should return false if no items were found', () => {
    expect(collection.search(5)).toEqual(false)
  })
})
