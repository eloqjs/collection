import { collect } from '../../src'

describe('transform()', () => {
  it('should iterate over the collection and transform it', () => {
    const collection = collect([{ id: 1 }, { id: 2 }, { id: 3 }])

    collection.transform((item) => ({ id: item.id * 2 }))

    expect(collection).toEqual([{ id: 2 }, { id: 4 }, { id: 6 }])
  })

  it('should mutate the original collection', () => {
    const collection = collect([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])

    const transformed = collection
      .transform((item) => ({ id: item.id * 2 }))
      .transform((item) => ({ id: item.id * 2 }))

    expect(transformed).toEqual(collection)
    expect(transformed).toEqual([{ id: 4 }, { id: 8 }, { id: 12 }, { id: 16 }])
  })

  it('should work exactly like map, but modify the collection', () => {
    const tCollection = collect([{ id: 1 }, { id: 2 }, { id: 3 }])
    const transformed = tCollection.transform((item) => ({ id: item.id * 5 }))

    expect(tCollection).toEqual(transformed)
    expect(tCollection).toEqual([{ id: 5 }, { id: 10 }, { id: 15 }])
    expect(transformed).toEqual([{ id: 5 }, { id: 10 }, { id: 15 }])

    const mCollection = collect([{ id: 1 }, { id: 2 }, { id: 3 }])
    const mapped = mCollection.map((item) => ({ id: item.id * 5 }))

    expect(mCollection).not.toEqual(mapped)
    expect(mCollection).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
    expect(mapped).toEqual([{ id: 5 }, { id: 10 }, { id: 15 }])
  })

  it('should be able to modify the keys of the items', () => {
    const collection = collect([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 }
    ]).transform((item) => ({ number: item.id }))

    expect(collection).toEqual([
      { number: 1 },
      { number: 2 },
      { number: 3 },
      { number: 4 },
      { number: 5 }
    ])
  })
})
