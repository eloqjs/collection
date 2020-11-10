import { collect, Collection } from '../src'

describe('Initialize Collection', () => {
  it('Should create an instance of Collection', () => {
    const collection = new Collection()

    expect(collection).toBeInstanceOf(Collection)
    expect(collect()).toBeInstanceOf(Collection)
  })

  it('Should accept multiple parameters', () => {
    const array = [{}, {}, {}]
    const collection = new Collection(...array)

    expect(collection).toEqual(array)
    expect(collect(...array)).toEqual(array)
  })

  it('Should accept an array', () => {
    const array = [{}, {}, {}]
    const collection = new Collection(array)

    expect(collection).toEqual(array)
    expect(collect(array)).toEqual(array)
  })

  it('Should return itself using items property', () => {
    const array = [{}, {}, {}]
    const collection = new Collection(array)

    expect(collection.items).toEqual(array)
    expect(collect(array).items).toEqual(array)
  })

  it('Should mutate itself using items property', () => {
    const array1 = [{}, {}, {}]
    const array2 = [{}, {}, {}, {}, {}, {}]
    const collection1 = new Collection(array1)
    const collection2 = collect(array1)

    expect(collection1.items).toEqual(array1)
    expect(collection2.items).toEqual(array1)

    collection1.items = collect(array2)
    collection2.items = collect(array2)

    expect(collection1.items).toEqual(array2)
    expect(collection2.items).toEqual(array2)
  })
})
