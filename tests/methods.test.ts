import { collect, Collection } from '../src'
import { hoax } from './utils'

describe('Protected Methods', () => {
  describe('newInstance()', () => {
    it('Should create a new instance of Collection', () => {
      const array = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const collection = collect(array)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const newInstance = collection.newInstance(array)

      expect(newInstance).toBeInstanceOf(Collection)
      expect(newInstance).toEqual(collection)
    })
  })

  describe('newCollection()', () => {
    it('Should wrap an array with another collection library', () => {
      const array = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const collection = collect(array)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(collection.newCollection(array)).toEqual(array)
    })
  })

  describe('primaryKey()', () => {
    it('Should get the primary key for the item', () => {
      const collection = collect()

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(collection.primaryKey()).toBe('id')
    })
  })

  describe('getPrimaryKey()', () => {
    it("Should get the value of the item's primary key", () => {
      const array = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const collection = collect(array)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(collection.getPrimaryKey(collection.first())).toBe(1)
    })
  })
})

describe('Public Methods', () => {
  describe('chunk()', () => {
    it('Should break the collection into multiple, smaller collections of a given size', () => {
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

  describe('collapse()', () => {
    it('Should collapse an array of collections into a single, flat collection', () => {
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

    it('Should accept multiple parameters', () => {
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

    it('Should accept an array', () => {
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

    it('Should throw an error if the array contains only a single collection', () => {
      const chunkArray = [[{ id: 1 }, { id: 2 }, { id: 3 }]]
      const collection = collect<{ id: number }>()
      const errorModel = () => {
        collection.collapse(chunkArray)
      }

      expect(errorModel).toThrow(
        'The array must contain multiple collections. Use push() for single a collection.'
      )
    })

    it('Should throw an error if the array contains items instead of collections', () => {
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

  describe('contains()', () => {
    it('should return whether the collection contains a given item', () => {
      const collection = collect([
        {
          name: 'Steven Gerrard',
          number: 8
        },
        {
          name: 'Steve Jobs',
          number: 2
        }
      ])

      expect(collection.contains(collection.first())).toBeTruthy()
    })

    it('Should accept a key / value pair', () => {
      const collection = collect([
        {
          name: 'Steven Gerrard',
          number: 8
        },
        {
          name: 'Steve Jobs',
          number: 2
        }
      ])

      expect(collection.contains('name', 'Steven Gerrard')).toBeTruthy()
      expect(collection.contains('name', 'Gerrard')).toBeFalsy()
    })

    it('Should accept a closure', () => {
      const collection = collect([
        {
          name: 'Steven Gerrard',
          number: 8
        },
        {
          name: 'Steve Jobs',
          number: 6
        }
      ])

      const contains = collection.contains((item) => item.number > 5)
      expect(contains).toBeTruthy()

      const contains2 = collection.contains((item) => item.number < 5)
      expect(contains2).toBeFalsy()
    })
  })

  describe('count()', () => {
    it('Should return the number of items in the collection', () => {
      const array = [{ id: 1 }]

      expect(collect(array).count()).toBe(1)

      array.push({ id: 2 })

      expect(collect(array).count()).toBe(2)

      array.push({ id: 3 })

      expect(collect(array).count()).toBe(3)
    })
  })

  describe('dd()', () => {
    it('Should dump the collection and exit the current process', () => {
      const mockConsole = hoax(console, 'log')
      const mockProcess = hoax(process, 'exit')
      const collection = collect([{ id: 1 }, { id: 2 }, { id: 3 }])

      collection.dd()

      mockConsole.reset()
      mockProcess.reset()

      expect(mockConsole.calls).toEqual([[collection]])
      expect(mockProcess.calls).toEqual([[1]])
    })
  })

  describe('dump()', () => {
    it('Should console log the collection', () => {
      const mockConsole = hoax(console, 'log')
      const collection = collect([{ id: 1 }, { id: 2 }, { id: 3 }])

      collection.dump()

      mockConsole.reset()

      expect(mockConsole.calls).toEqual([[collection]])
    })
  })
})
