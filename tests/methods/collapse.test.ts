import { collect } from '../../src'

describe('collapse()', () => {
  it('should collapse an array of collections into a single, flat collection', () => {
    const array = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
      { id: 7 },
      { id: 8 },
      { id: 9 }
    ]
    const chunkArray = [
      [{ id: 4 }, { id: 5 }, { id: 6 }],
      [{ id: 7 }, { id: 8 }, { id: 9 }]
    ]
    const collection = collect([{ id: 1 }, { id: 2 }, { id: 3 }])

    expect(collection.collapse(chunkArray)).toEqual(array)
  })

  it('should accept multiple parameters', () => {
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
    const collection = collect<{ id: number }>()

    expect(collection.collapse(...chunkArray)).toEqual(array)
  })

  it('should accept an array', () => {
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
    const collection = collect<{ id: number }>()

    expect(collection.collapse(chunkArray)).toEqual(array)
  })

  it('should throw an error if the array contains only a single collection', () => {
    const chunkArray = [[{ id: 1 }, { id: 2 }, { id: 3 }]]
    const collection = collect<{ id: number }>()
    const errorModel = () => {
      collection.collapse(chunkArray)
    }

    expect(errorModel).toThrow(
      'The array must contain multiple collections. Use push() for single a collection.'
    )
  })

  it('should throw an error if the array contains items instead of collections', () => {
    const chunkArray = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const collection = collect<{ id: number }>()
    const errorModel = () => {
      collection.collapse(chunkArray)
    }

    expect(errorModel).toThrow(
      'The array must contain multiple collections. Use push() for single a collection.'
    )
  })
})
