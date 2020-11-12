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

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(collection.newCollection(array)).not.toBeInstanceOf(Collection)
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

  describe('where()', () => {
    const products = [
      { product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
      { product: 'Door', price: '100' }
    ]
    const collection = collect(products)

    it('Should filter the collection by a given key/value pair', () => {
      const filtered = collection.where('price', 100)

      expect(filtered).toEqual([
        { product: 'Chair', price: 100, manufacturer: 'Herman Miller' }
      ])
      expect(collection).toEqual(products)
    })

    it('Should return everything that matches', () => {
      const filtered = collection.where('manufacturer', 'IKEA')

      expect(filtered).toEqual([
        { product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
      ])
      expect(collection).toEqual(products)
    })

    it('Should accept a custom operator: less than', () => {
      const under200 = collection.where('price', '<', 150)

      expect(under200).toEqual([
        { product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { product: 'Door', price: '100' }
      ])
    })

    it('Should accept a custom operator: less than or equal to', () => {
      const overOrExactly150 = collection.where('price', '<=', 150)

      expect(overOrExactly150).toEqual([
        { product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
        { product: 'Door', price: '100' }
      ])
    })

    it('Should accept a custom operator: bigger than', () => {
      const over150 = collection.where('price', '>', 150)

      expect(over150).toEqual([
        { product: 'Desk', price: 200, manufacturer: 'IKEA' }
      ])
    })

    it('Should accept a custom operator: bigger than or equal to', () => {
      const overOrExactly150 = collection.where('price', '>=', 150)

      expect(overOrExactly150).toEqual([
        { product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
      ])
    })

    it('Should accept a custom operator: loosely equal', () => {
      const loosly100 = collection.where('price', '==', 100)

      expect(loosly100).toEqual([
        { product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { product: 'Door', price: '100' }
      ])
    })

    it('Should accept a custom operator: strictly not equal', () => {
      const not100 = collection.where('price', '!==', 100)

      expect(not100).toEqual([
        { product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
        { product: 'Door', price: '100' }
      ])
    })

    it('Should accept a custom operator: loosely not equal', () => {
      const not200 = collection.where('price', '!=', 200)

      expect(not200).toEqual([
        { product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
        { product: 'Door', price: '100' }
      ])

      const not100 = collection.where('price', '<>', 100)

      expect(not100).toEqual([
        { product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
      ])
    })

    it('Should work with nested objects', () => {
      const collection2 = collect([
        { product: 'Desk', price: 200, foo: { bar: 1 } },
        { product: 'Chair', price: 100, foo: { bar: 2 } },
        { product: 'Bookcase', price: 150, foo: { bar: 2 } },
        { product: 'Door', price: 100, foo: { bar: 1 } }
      ])

      const filtered = collection2.where('foo.bar', 1)

      expect(filtered).toEqual([
        {
          product: 'Desk',
          price: 200,
          foo: {
            bar: 1
          }
        },
        {
          product: 'Door',
          price: 100,
          foo: {
            bar: 1
          }
        }
      ])
    })

    it('Should work when only passing one argument', () => {
      const hasManufacturer = collection.where('manufacturer')

      expect(hasManufacturer).toEqual([
        { product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
      ])

      const hasProduct = collection.where('product')

      expect(hasProduct).toEqual([
        { product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
        { product: 'Door', price: '100' }
      ])
    })

    it('Should work when passing two argument', () => {
      const hasManufacturer = collection.where('manufacturer', true)

      expect(hasManufacturer).toEqual([
        { product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
      ])

      const dontHaveManufacturer = collection.where('manufacturer', false)

      expect(dontHaveManufacturer).toEqual([{ product: 'Door', price: '100' }])
    })

    it('Should work with nested properties', () => {
      const collection2 = collect([
        { name: { firstname: 'Mohamed', lastname: 'Salah' } },
        { name: { firstname: 'Sadio', lastname: 'Mané' } },
        { name: { firstname: 'Roberto', lastname: 'Firmino' } }
      ])

      expect(collection2.where('name.lastname', 'Mané')).toEqual([
        { name: { firstname: 'Sadio', lastname: 'Mané' } }
      ])
    })
  })
})
