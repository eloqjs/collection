import { collect, Collection } from '../src'
import type { ItemData } from '../types'

describe('Initialize Collection', () => {
  describe('collect()', () => {
    it('should create an instance of Collection', () => {
      expect(collect()).toBeInstanceOf(Collection)
    })

    it('should accept multiple parameters', () => {
      const array = [{}, {}, {}]
      const collection = collect(...array)

      expect(collection).toEqual(array)
    })

    it('should accept an array', () => {
      const array = [{}, {}, {}]
      const collection = collect(array)

      expect(collection).toEqual(array)
    })

    it('should return unwrapped items using items property', () => {
      const array1 = [{}, {}, {}]
      const array2 = [{ data: {} }, { data: {} }, { data: {} }]
      const collection1 = collect(array1)
      const collection2 = collect(array2)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(collection1.items).toEqual(array1)
      expect(collection1).toEqual(array1)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(collection2.items).toEqual(array1)
      expect(collection2).toEqual(array2)
    })

    it('should mutate itself using items property', () => {
      const array1 = [{}, {}, {}]
      const array2 = [{}, {}, {}, {}, {}, {}]
      const collection = collect(array1)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(collection.items).toEqual(array1)
      expect(collection).toEqual(array1)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      collection.items = collect(array2)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(collection.items).toEqual(array2)
      expect(collection).toEqual(array2)
    })

    it('should map items back to their original state using items property', () => {
      const array1 = [{}, {}, {}]
      const array2 = [{}, {}, {}, {}, {}, {}]
      const array3 = [{ data: {} }, { data: {} }, { data: {} }]
      const collection = collect(array3)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(collection.items).toEqual(array1)
      expect(collection).toEqual(array3)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      collection.items = collect(array2)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(collection.items).toEqual(array2)
      expect(collection).toEqual([
        { data: {} },
        { data: {} },
        { data: {} },
        { data: {} },
        { data: {} },
        { data: {} }
      ])
    })

    it('should be extendable', () => {
      Collection.primaryKey = () => 'slug'
      Collection.newQuery = <T extends ItemData>() => {
        return ({
          id: 3,
          slug: 'my-incredible-post',
          title: 'My Incredible Post'
        } as unknown) as T
      }
      Collection.getFresh = async <T extends ItemData>(): Promise<
        T[] | Collection<T>
      > => {
        return await new Promise((resolve) => {
          setTimeout(() => {
            const items = ([
              { id: 1, slug: 'my-awesome-post', title: 'My Awesome Post' },
              {
                id: 2,
                slug: 'my-super-awesome-post',
                title: 'My Super Awesome Post'
              }
            ] as unknown) as T[]
            resolve(items)
          }, 250)
        })
      }

      const collection = collect([
        { id: 1, slug: 'my-awesome-post', title: 'My Awesome Post' },
        {
          id: 2,
          slug: 'my-super-awesome-post',
          title: 'My Super Awesome Post'
        },
        { id: 3, slug: 'my-incredible-post', title: 'My Incredible Post' },
        { id: 4, slug: 'my-incredible-post', title: 'My Incredible Post' }
      ])
      const unique = collection.unique()

      expect(unique).toEqual([
        { id: 1, slug: 'my-awesome-post', title: 'My Awesome Post' },
        {
          id: 2,
          slug: 'my-super-awesome-post',
          title: 'My Super Awesome Post'
        },
        { id: 4, slug: 'my-incredible-post', title: 'My Incredible Post' }
      ])
      expect(collection.toQuery()).toEqual({
        id: 3,
        slug: 'my-incredible-post',
        title: 'My Incredible Post'
      })
    })
  })
})
