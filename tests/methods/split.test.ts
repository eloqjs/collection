import { collect, Collection } from '../../src'

describe('split()', () => {
  const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]

  it('should split a collection into the given number of collections', () => {
    const collection = collect(data)

    expect(collection.split(2)).toEqual([
      collect([{ id: 1 }, { id: 2 }, { id: 3 }]),
      collect([{ id: 4 }, { id: 5 }])
    ])
  })

  it('should return an array of collections', () => {
    const collection = collect(data)

    collection.split(2).forEach((collection) => {
      expect(collection).toBeInstanceOf(Collection)
    })
  })
})
