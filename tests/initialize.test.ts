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
})
