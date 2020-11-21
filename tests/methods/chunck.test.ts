import { collect } from '../../src'

describe('chunk()', () => {
  it('should break the collection into multiple, smaller collections of a given size', () => {
    const array = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 }
    ]
    const chunkArray = [
      [{ id: 1 }, { id: 2 }, { id: 3 }],
      [{ id: 4 }, { id: 5 }, { id: 6 }]
    ]
    const collection = collect(array)

    expect(collection.chunk(3)).toEqual(chunkArray)
  })
})
