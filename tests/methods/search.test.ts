import { collect } from '../../src'

describe('search()', () => {
  it('should search the collection for the given value and returns its key if found', () => {
    const collection = collect([
      { id: 1, name: 'Test' },
      { id: 2, name: 'Test2' }
    ])

    expect(collection.search((item) => item.id > 1)).toEqual(1)
  })

  it('should return false if no items were found', () => {
    const collection = collect([
      { id: 1, name: 'Test' },
      { id: 2, name: 'Test2' }
    ])

    expect(collection.search((item) => item.id > 2)).toEqual(false)
  })
})
