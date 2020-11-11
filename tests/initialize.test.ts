import { collect, Collection } from '../src'

describe('Initialize Collection', () => {
  describe('collect()', () => {
    it('Should create an instance of Collection', () => {
      expect(collect()).toBeInstanceOf(Collection)
    })

    it('Should accept multiple parameters', () => {
      const array = [{}, {}, {}]
      const collection = collect(...array)

      expect(collection).toEqual(array)
    })

    it('Should accept an array', () => {
      const array = [{}, {}, {}]
      const collection = collect(array)

      expect(collection).toEqual(array)
    })

    it('Should return itself using items property', () => {
      const array = [{}, {}, {}]
      const collection = collect(array)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(collection.items).toEqual(array)
    })

    it('Should mutate itself using items property', () => {
      const array1 = [{}, {}, {}]
      const array2 = [{}, {}, {}, {}, {}, {}]
      const collection = collect(array1)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(collection.items).toEqual(array1)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      collection.items = collect(array2)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(collection.items).toEqual(array2)
    })
  })
})
