import { collect } from '../../src'

describe('getDictionary()', () => {
  const users = [
    { id: 1, name: 'Joe Doe' },
    { id: 2, name: 'John Doe' },
    { id: 3, name: 'Alex Doe' },
    { id: 4, name: 'Mary Doe' }
  ]

  it('should return a dictionary of the given items keyed by primary keys', () => {
    const collection = collect<{ id: number; name: string }>()

    expect(collection.getDictionary(collect(users))).toEqual({
      '1': { id: 1, name: 'Joe Doe' },
      '2': { id: 2, name: 'John Doe' },
      '3': { id: 3, name: 'Alex Doe' },
      '4': { id: 4, name: 'Mary Doe' }
    })
  })

  it('should return a dictionary of the collection keyed by primary keys', () => {
    const collection = collect(users)

    expect(collection.getDictionary()).toEqual({
      '1': { id: 1, name: 'Joe Doe' },
      '2': { id: 2, name: 'John Doe' },
      '3': { id: 3, name: 'Alex Doe' },
      '4': { id: 4, name: 'Mary Doe' }
    })
  })
})
