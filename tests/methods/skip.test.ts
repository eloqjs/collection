import { collect } from '../../src'

describe('skip()', () => {
  it('should skip n number of items', () => {
    const collection = collect([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 }
    ])

    expect(collection.skip(4)).toEqual([{ id: 5 }])
  })
})
