import { collect } from '../../src'

describe('put()', () => {
  const data = [
    { id: 1, name: 'Alex Doe' },
    { id: 2, name: 'Joe Doe' },
    { id: 3, name: 'John Doe' }
  ]

  it('should override an item in the collection when the primary key matches any existing item', () => {
    const collection = collect(data)
    const modified = collection.put({ id: 2, name: 'Mary Doe' })

    expect(collection).toEqual(modified)
    expect(collection).toEqual([
      { id: 1, name: 'Alex Doe' },
      { id: 2, name: 'Mary Doe' },
      { id: 3, name: 'John Doe' }
    ])
  })

  it('should push the item into the collection when the primary key does not match any existing item', () => {
    const collection = collect(data)
    const modified = collection.put({ id: 4, name: 'Mary Doe' })

    expect(collection).toEqual(modified)
    expect(collection).toEqual([...data, { id: 4, name: 'Mary Doe' }])
  })
})
