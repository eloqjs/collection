import { collect } from '../../src'

describe('find()', () => {
  const users = [
    { id: 1, name: 'Joe Doe' },
    { id: 2, name: 'John Doe' },
    { id: 3, name: 'Alex Doe' },
    { id: 4, name: 'Mary Doe' }
  ]

  it('should find an item by its primary key', () => {
    const collection = collect(users)

    expect(collection.find(3)).toEqual({ id: 3, name: 'Alex Doe' })
  })

  it('should find multiple items by their primary keys', () => {
    const collection = collect(users)

    expect(collection.find([2, 3])).toEqual([
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Alex Doe' }
    ])
  })

  it('should accept an item', () => {
    const collection = collect(users)

    expect(collection.find({ id: 3, name: 'Alex Doe' })).toEqual({
      id: 3,
      name: 'Alex Doe'
    })
  })

  it('should return null when the item is not found', () => {
    const collection = collect(users)

    expect(collection.find(5)).toBeNull()
  })

  it('should return an empty collection when no items are found', () => {
    const collection = collect(users)

    expect(collection.find([8, 9])).toEqual([])
  })

  it('should return itself when trying to find multiple items, but collection is empty', () => {
    expect(collect().find([8, 9])).toEqual([])
  })

  it('should be able to use standard find()', () => {
    const collection = collect(users)

    expect(collection.find((item) => item.id === 1)).toEqual({
      id: 1,
      name: 'Joe Doe'
    })
  })
})
