import { collect } from '../../src'

describe('modelKeys()', () => {
  it('should return an array of primary keys', () => {
    const collection = collect([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 }
    ])

    expect(collection.modelKeys()).toEqual([1, 2, 3, 4, 5])
  })
})
