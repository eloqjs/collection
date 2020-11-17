import { collect, Collection } from '../src'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { hoax } from './utils'

describe('Protected Methods', () => {
  describe('newInstance()', () => {
    it('should create a new instance of Collection', () => {
      const array = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const collection = collect(array)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const newInstance = collection.newInstance(array)

      expect(newInstance).toBeInstanceOf(Collection)
      expect(newInstance).toEqual(collection)
    })
  })

  describe('primaryKey()', () => {
    it('should get the primary key for the item', () => {
      const collection = collect()

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(collection.primaryKey()).toBe('id')
    })
  })

  describe('getPrimaryKey()', () => {
    it("should get the value of the item's primary key", () => {
      const array = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const collection = collect(array)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(collection.getPrimaryKey(collection.first())).toBe(1)
    })
  })
})

describe('Public Methods', () => {
  const products = [
    { name: 'Chair', price: 600 },
    { name: 'Desk', price: 900 },
    { name: 'Lamp', price: 150 }
  ]

  describe('average()', () => {
    it('should return the average value of collection values by key', () => {
      const collection = collect(products)
      const avg = collection.average('price')
      expect(avg).toBe(550)
      expect(collection).toEqual(products)
    })
  })

  describe('avg()', () => {
    it('should return the average value of collection values by key', () => {
      const collection = collect(products)
      const avg = collection.avg('price')
      expect(avg).toBe(550)
      expect(collection).toEqual(products)
    })
  })

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

    it('should accept a key / value pair', () => {
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

    it('should return false when only key was provided', () => {
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

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(collection.contains('name')).toBeFalsy()
    })

    it('should accept a closure', () => {
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
    it('should return the number of items in the collection', () => {
      const array = [{ id: 1 }]

      expect(collect(array).count()).toBe(1)

      array.push({ id: 2 })

      expect(collect(array).count()).toBe(2)

      array.push({ id: 3 })

      expect(collect(array).count()).toBe(3)
    })
  })

  describe('countBy()', () => {
    it('should count occurrences based on the closure', () => {
      const collection = collect([
        { name: 'alice', email: 'alice@gmail.com' },
        { name: 'aaron', email: 'aaron@gmail.com' },
        { name: 'bob', email: 'bob@yahoo.com' },
        { name: 'carla', email: 'carlos@outlook.com' }
      ])

      const counted = collection.countBy((user) => user.email.split('@')[1])

      expect(counted).toEqual({
        'gmail.com': 2,
        'yahoo.com': 1,
        'outlook.com': 1
      })
    })
  })

  describe('dd()', () => {
    it('should dump the collection and exit the current process', () => {
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

  describe('diff()', () => {
    it('should return the missing values from collection', () => {
      const products1 = [
        { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
        { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
        { id: 5, product: 'Bed', price: 200, manufacturer: 'Herman Miller' }
      ]
      const products2 = [
        { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
        { id: 9, product: 'Door', price: 100, manufacturer: 'IKEA' }
      ]
      const collection1 = collect(products1)
      const collection2 = collect(products2)
      const diff = collection1.diff(collection2)

      expect(diff).toEqual([
        { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
        { id: 5, product: 'Bed', price: 200, manufacturer: 'Herman Miller' }
      ])
      expect(collection1).toEqual(products1)
    })
  })

  describe('dump()', () => {
    it('should console log the collection', () => {
      const mockConsole = hoax(console, 'log')
      const collection = collect([{ id: 1 }, { id: 2 }, { id: 3 }])

      collection.dump()

      mockConsole.reset()

      expect(mockConsole.calls).toEqual([[collection]])
    })
  })

  describe('each()', () => {
    it('should iterate over the collection', () => {
      let sum = 0
      const products = [
        { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
        { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
        { id: 5, product: 'Bed', price: 200, manufacturer: 'Herman Miller' }
      ]
      const collection = collect(products)

      const each = collection.each((item) => {
        sum += item.price
      })

      expect(each).toEqual(products)
      expect(sum).toEqual(800)
      expect(collection).toEqual(products)

      let sum2 = 0

      const summed = collection.each((item) => {
        if (item.price > 150) {
          return
        }

        sum2 += item.price
      })

      expect(summed).toEqual(products)
      expect(sum2).toEqual(400)
    })

    it('should stop iterating, when returning false', () => {
      const products = [
        { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
        { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
        { id: 5, product: 'Bed', price: 200, manufacturer: 'Herman Miller' }
      ]
      const collection = collect(products)

      const result: unknown[] = []

      collection.each((item, key) => {
        if (item.price === 150) {
          return false
        }

        result[key] = item
      })

      expect(result).toEqual([
        { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' }
      ])
    })

    it('should not modify the collection', () => {
      const products = [
        { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
        { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
        { id: 5, product: 'Bed', price: 200, manufacturer: 'Herman Miller' }
      ]
      const collection = collect(products)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const mapped = collection.each((item) => item.price * 2)

      expect(collection).toEqual(products)
      expect(mapped).toEqual(collection)
    })
  })

  describe('first()', () => {
    const products = [
      { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
      { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
      { id: 5, product: 'Bed', price: 200, manufacturer: 'Herman Miller' }
    ]

    it('should return the first item from the collection', () => {
      const collection = collect(products)
      const first = collection.first()

      expect(first).toEqual(products[0])
      expect(collection).toEqual(products)
    })

    it('should return an empty object when no matches', () => {
      const collection = collect([])
      const first = collection.first()

      expect(first).toStrictEqual({})
    })

    it('should accept a callback', () => {
      const collection = collect(products)
      const first = collection.first((item) => item.price < 150)

      expect(first).toEqual(products[1])
      expect(collection).toEqual(products)
    })

    it('should return an empty object when no matches on callback', () => {
      const collection = collect(products)
      const first = collection.first((item) => item.price > 200)

      expect(first).toStrictEqual({})
    })
  })

  describe('firstWhere()', () => {
    const products = [
      { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
      { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
      { id: 5, product: 'Bed', price: 200, manufacturer: 'Herman Miller' }
    ]

    it('should return the first item where it matches', () => {
      const collection = collect(products)

      expect(collection.firstWhere('manufacturer', 'IKEA').product).toEqual(
        'Desk'
      )
    })

    it('should return an empty object when no matches', () => {
      const collection = collect(products)

      expect(collection.firstWhere('manufacturer', 'xoxo')).toStrictEqual({})
    })

    it('should be possible to pass an operator', () => {
      const collection = collect(products)

      expect(
        collection.firstWhere('manufacturer', '!==', 'IKEA').product
      ).toEqual('Chair')
    })
  })

  describe('forPage()', () => {
    it('should return a collection containing the items that would be present on a given page number', () => {
      const products = [
        { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
        { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
        {
          id: 5,
          product: 'Monitor',
          price: 200,
          manufacturer: 'Herman Miller'
        },
        { id: 6, product: 'Mouse', price: 50, manufacturer: 'IKEA' },
        { id: 7, product: 'Keyboard', price: 300, manufacturer: 'IKEA' },
        {
          id: 8,
          product: 'Notebook',
          price: 350,
          manufacturer: 'Herman Miller'
        },
        { id: 9, product: 'Door', price: 100, manufacturer: 'IKEA' }
      ]
      const collection = collect(products)

      const forPage1 = collection.forPage(1, 3)
      expect(forPage1).toEqual([
        { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
      ])

      const forPage2 = collection.forPage(2, 3)
      expect(forPage2).toEqual([
        { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
        {
          id: 5,
          product: 'Monitor',
          price: 200,
          manufacturer: 'Herman Miller'
        },
        { id: 6, product: 'Mouse', price: 50, manufacturer: 'IKEA' }
      ])

      const forPage3 = collection.forPage(3, 3)
      expect(forPage3).toEqual([
        { id: 7, product: 'Keyboard', price: 300, manufacturer: 'IKEA' },
        {
          id: 8,
          product: 'Notebook',
          price: 350,
          manufacturer: 'Herman Miller'
        },
        { id: 9, product: 'Door', price: 100, manufacturer: 'IKEA' }
      ])

      expect(collection).toEqual(products)
    })
  })

  describe('forget()', () => {
    it('should delete by index', () => {
      const collection = collect([
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 }
      ])
      const forget = collection.forget(2)

      expect(forget).toEqual([{ id: 1 }, { id: 2 }, { id: 4 }, { id: 5 }])
      expect(collection).toEqual([{ id: 1 }, { id: 2 }, { id: 4 }, { id: 5 }])
    })
  })

  describe('get()', () => {
    const data = [{ id: 1 }, { id: 2 }]
    const collection = collect(data)

    it('should return the item at a given index', () => {
      expect(collection.get(1)).toEqual({ id: 2 })
      expect(collection).toEqual(data)
    })

    it('should return null when the index does not exist', () => {
      expect(collection.get(2)).toBeNull()
      expect(collection).toEqual(data)
    })
  })

  describe('groupBy()', () => {
    const products = [
      { product: 'Catalog', manufacturer: 'IKEA', price: 0 },
      { product: 'Desk', manufacturer: 'IKEA', price: 60 },
      { product: 'Chair', manufacturer: 'IKEA', price: 60 },
      { product: 'Lamp', manufacturer: 'IKEA', price: 15 },
      { product: 'Chair', manufacturer: 'Herman Miller' }
    ]

    it('should group the collections items by the given key', () => {
      const collection = collect(products)
      const grouped = collection.groupBy('manufacturer')

      expect(Object.keys(grouped)).toEqual(['IKEA', 'Herman Miller'])
      expect(collection).toEqual(products)
    })

    it('should accept a custom callback to group by', () => {
      const collection = collect(products)
      const grouped = collection.groupBy((item) =>
        item.manufacturer.substring(0, 3)
      )

      expect(grouped).toEqual({
        IKE: collect([
          { product: 'Catalog', manufacturer: 'IKEA', price: 0 },
          { product: 'Desk', manufacturer: 'IKEA', price: 60 },
          { product: 'Chair', manufacturer: 'IKEA', price: 60 },
          { product: 'Lamp', manufacturer: 'IKEA', price: 15 }
        ]),
        Her: collect([{ product: 'Chair', manufacturer: 'Herman Miller' }])
      })

      expect(collection).toEqual(products)
    })

    it('should return a collection of collections when grouped', () => {
      const collection = collect(products)
      const grouped = collection.groupBy('manufacturer')

      expect(grouped.IKEA).toEqual([
        { product: 'Catalog', manufacturer: 'IKEA', price: 0 },
        { product: 'Desk', manufacturer: 'IKEA', price: 60 },
        { product: 'Chair', manufacturer: 'IKEA', price: 60 },
        { product: 'Lamp', manufacturer: 'IKEA', price: 15 }
      ])

      expect(grouped['Herman Miller']).toEqual([
        { product: 'Chair', manufacturer: 'Herman Miller' }
      ])

      expect(collection).toEqual(products)
    })

    it(
      'should use an empty string as the key ' +
        'if objects are missing the key to group by',
      () => {
        const collection = collect(products)
        const grouped = collection.groupBy('price')

        expect(grouped).toEqual({
          0: collect([{ product: 'Catalog', manufacturer: 'IKEA', price: 0 }]),
          15: collect([{ product: 'Lamp', manufacturer: 'IKEA', price: 15 }]),
          60: collect([
            { product: 'Desk', manufacturer: 'IKEA', price: 60 },
            { product: 'Chair', manufacturer: 'IKEA', price: 60 }
          ]),
          '': collect([{ product: 'Chair', manufacturer: 'Herman Miller' }])
        })

        expect(collection).toEqual(products)
      }
    )

    it('should be able to use nested value as key', () => {
      const collection = collect([
        {
          name: 'Virgil van Dijk',
          club: {
            name: 'Liverpool FC'
          }
        },
        {
          name: 'Sadio Mané',
          club: {
            name: 'Liverpool FC'
          }
        }
      ])

      const grouped = collection.groupBy('club.name')

      expect(grouped['Liverpool FC']).toEqual(collection)
    })
  })

  describe('implode()', () => {
    it('should glue together the collection', () => {
      const collection = collect([
        { product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
        { product: 'Door', price: '100' }
      ])

      const implodeProduct = collection.implode('product', '-')
      const implodePrice = collection.implode('price', '-')
      const implodeManufacturer = collection.implode('manufacturer', '-')

      expect(implodeProduct).toEqual('Desk-Chair-Bookcase-Door')
      expect(implodePrice).toEqual('200-100-150-100')
      expect(implodeManufacturer).toEqual('IKEA-Herman Miller-IKEA-')
    })

    it('should replace null with a blank value', () => {
      const collection = collect([
        { product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
        { product: 'Door', price: '100' }
      ])
      const implodeManufacturer = collection.implode('manufacturer', '-')

      expect(implodeManufacturer).toEqual('IKEA-Herman Miller-IKEA-')
    })
  })

  describe('intersect()', () => {
    it('should return the matching values from collection', () => {
      const products1 = [
        { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
        { id: 4, product: 'Table', price: 150, manufacturer: 'IKEA' },
        { id: 5, product: 'Bed', price: 200, manufacturer: 'Herman Miller' }
      ]
      const products2 = [
        { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
        { id: 9, product: 'Door', price: 100, manufacturer: 'IKEA' }
      ]
      const collection1 = collect(products1)
      const collection2 = collect(products2)
      const intersect = collection1.intersect(collection2)

      expect(intersect).toEqual([
        { id: 1, product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { id: 2, product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { id: 3, product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
      ])
      expect(collection1).toEqual(products1)
    })
  })

  describe('isEmpty()', () => {
    it('should return true if collection is empty', () => {
      expect(collect().isEmpty()).toBeTruthy()
      expect(collect([]).isEmpty()).toBeTruthy()
    })

    it('should return false if collection is not empty', () => {
      expect(collect({ key: 'value' }).isEmpty()).toBeFalsy()
    })
  })

  describe('isNotEmpty()', () => {
    it('should return false if collection is empty', () => {
      expect(collect().isNotEmpty()).toBeFalsy()
      expect(collect([]).isNotEmpty()).toBeFalsy()
    })

    it('should return true if collection is not empty', () => {
      expect(collect({ key: 'value' }).isNotEmpty()).toBeTruthy()
    })
  })

  describe('keyBy', () => {
    const data = [
      {
        id: 100,
        product: 'Chair',
        manufacturer: 'IKEA',
        price: '1490 NOK'
      },
      {
        id: 150,
        product: 'Desk',
        manufacturer: 'IKEA',
        price: '900 NOK'
      },
      {
        id: 200,
        product: 'Chair',
        manufacturer: 'Herman Miller',
        price: '9990 NOK'
      }
    ]

    it('should key the collection by the given key', () => {
      const collection = collect(data)
      const keyed = collection.keyBy('manufacturer')

      expect(keyed).toEqual({
        IKEA: {
          id: 150,
          product: 'Desk',
          manufacturer: 'IKEA',
          price: '900 NOK'
        },
        'Herman Miller': {
          id: 200,
          product: 'Chair',
          manufacturer: 'Herman Miller',
          price: '9990 NOK'
        }
      })

      expect(collection).toEqual(data)
    })

    it('should key the collection by the given callback', () => {
      const collection = collect(data)
      const keyedUpperCase = collection.keyBy((item) =>
        item.manufacturer.toUpperCase()
      )

      expect(keyedUpperCase).toEqual({
        IKEA: {
          id: 150,
          product: 'Desk',
          manufacturer: 'IKEA',
          price: '900 NOK'
        },
        'HERMAN MILLER': {
          id: 200,
          product: 'Chair',
          manufacturer: 'Herman Miller',
          price: '9990 NOK'
        }
      })

      expect(collection).toEqual(data)
    })

    it('should only keep one items per key', () => {
      const collection = collect([
        {
          name: 'Sadio Mané',
          club: 'Liverpool FC'
        },
        {
          name: 'Roberto Firmino',
          club: 'Liverpool FC'
        },
        {
          name: 'Mohamed Salah',
          club: 'Liverpool FC'
        }
      ])

      const keyed = collection.keyBy('club')

      expect(keyed).toEqual({
        'Liverpool FC': {
          name: 'Mohamed Salah',
          club: 'Liverpool FC'
        }
      })
    })

    it('should key everything by an empty string if key does not exist', () => {
      const collection = collect(data)
      const keyed = collection.keyBy('xoxo')

      expect(keyed).toEqual({
        '': {
          id: 200,
          product: 'Chair',
          manufacturer: 'Herman Miller',
          price: '9990 NOK'
        }
      })

      expect(collection).toEqual(data)
    })

    it('should be able to use nested value as key', () => {
      const collection = collect([
        {
          name: 'Virgil van Dijk',
          club: {
            name: 'Liverpool FC'
          }
        },
        {
          name: 'Sadio Mané',
          club: {
            name: 'Liverpool FC'
          }
        }
      ])

      const keyed = collection.keyBy('club.name')

      expect(keyed['Liverpool FC']).toEqual({
        name: 'Sadio Mané',
        club: {
          name: 'Liverpool FC'
        }
      })
    })
  })

  describe('last()', () => {
    it('should return the last item from the collection', () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
      const collection = collect(data)
      const last = collection.last()

      expect(last).toEqual({ id: 4 })
      expect(collection).toEqual(data)
    })

    it('should accept custom callback', () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const collection = collect(data)
      const last = collection.last((item) => item.id > 1)

      expect(last).toEqual({ id: 3 })
      expect(collection).toEqual(data)
    })
  })

  describe('mapInto()', () => {
    class Person {
      public name: string

      constructor(item: { name: string }) {
        this.name = item.name
      }

      uppercase(): void {
        this.name = this.name.toUpperCase()
      }
    }

    const collection = collect([{ name: 'Firmino' }, { name: 'Mané' }])

    it('should map into a class', () => {
      const data = collection.mapInto(Person)
      expect(data).toBeInstanceOf(Array)

      expect(data.first()).toEqual(new Person({ name: 'Firmino' }))
      expect(data.last()).toEqual(new Person({ name: 'Mané' }))
    })

    it('should trigger the callback after apply class instance', () => {
      const data = collection.mapInto(Person, (person) => {
        person.uppercase()
      })

      expect(data.first()).toEqual(new Person({ name: 'FIRMINO' }))
      expect(data.last()).toEqual(new Person({ name: 'MANÉ' }))
    })
  })

  describe('mapToGroups()', () => {
    it('should map a collection to groups', () => {
      const data = collect([
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 3, name: 'C' },
        { id: 4, name: 'B' }
      ])

      const groups = data.mapToGroups((item) => [item.name, item.id])

      expect(groups).toEqual({
        A: [1],
        B: [2, 4],
        C: [3]
      })
    })
  })

  describe('mapWithKeys()', () => {
    it('should return an object containing a single key / value pair:', () => {
      const employees = [
        {
          name: 'John',
          department: 'Sales',
          email: 'john@example.com'
        },
        {
          name: 'Jane',
          department: 'Marketing',
          email: 'jane@example.com'
        }
      ]

      const collection = collect(employees)

      const keyed = collection.mapWithKeys((item) => [item.email, item.name])

      expect(keyed).toEqual({
        'john@example.com': 'John',
        'jane@example.com': 'Jane'
      })

      expect(collection).toEqual(employees)
    })
  })

  describe('max()', () => {
    it('should return the maximum value of a given key', () => {
      const data = [
        {
          value: 10
        },
        {
          value: -13
        },
        {
          value: 12
        },
        {
          value: undefined
        },
        {
          unicorn: false
        }
      ]
      const collection = collect(data)

      const max = collection.max('value')

      expect(max).toEqual(12)

      expect(collection).toEqual(data)
    })

    it('should return the maximum value of a given nested key', () => {
      const data = [
        {
          invoice: {
            value: 10
          }
        },
        {
          invoice: {
            value: -13
          }
        },
        {
          invoice: {
            value: 12
          }
        },
        {
          invoice: {
            value: undefined
          }
        },
        {
          unicorn: false
        }
      ]
      const collection = collect(data)

      const max = collection.max('invoice.value')

      expect(max).toEqual(12)

      expect(collection).toEqual(data)
    })
  })

  describe('median()', () => {
    it('should return the median value of collection values by key', () => {
      const collectionOfObjects = collect([
        { foo: 1 },
        { foo: 1 },
        { foo: 2 },
        { foo: 4 }
      ])

      expect(collectionOfObjects.median('foo')).toEqual(1.5)

      const collectionOfObjects2 = collect([
        { foo: 1 },
        { foo: 3 },
        { foo: 3 },
        { foo: 6 },
        { foo: 7 },
        { foo: 8 },
        { foo: 9 }
      ])

      expect(collectionOfObjects2.median('foo')).toEqual(6)
    })

    it('should return the median value of collection values by nested key', () => {
      const collectionOfObjects = collect([
        { foo: { bar: 1 } },
        { foo: { bar: 1 } },
        { foo: { bar: 2 } },
        { foo: { bar: 4 } }
      ])

      expect(collectionOfObjects.median('foo.bar')).toEqual(1.5)
    })
  })

  describe('min()', () => {
    it('should return the minimum value of a given key', () => {
      const data = [
        {
          worth: 100
        },
        {
          worth: 900
        },
        {
          worth: 79
        },
        {
          worth: undefined
        },
        {
          unicorn: false
        }
      ]

      const collection = collect(data)
      const minKey = collection.min('worth')
      expect(minKey).toEqual(79)
      expect(collection).toEqual(data)
    })

    it('should return the minimum value of a given nested key', () => {
      const data = [
        {
          foo: {
            worth: 100
          }
        },
        {
          foo: {
            worth: 900
          }
        },
        {
          foo: {
            worth: 79
          }
        },
        {
          foo: {
            worth: undefined
          }
        },
        {
          unicorn: false
        }
      ]

      const collection = collect(data)
      const minKey = collection.min('foo.worth')
      expect(minKey).toEqual(79)
      expect(collection).toEqual(data)
    })

    it('should work with negative values', () => {
      const data = [
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
        { value: -5 },
        { value: -4 },
        { value: -3 },
        { value: -2 },
        { value: -1 }
      ]
      const collection = collect(data)
      const min = collection.min('value')

      expect(collection).toEqual(data)
      expect(min).toEqual(-5)
    })
  })

  describe('mode()', () => {
    it('should return the mode value of collection values by key', () => {
      const collectionOfObjects = collect([
        { foo: 1 },
        { foo: 1 },
        { foo: 2 },
        { foo: 4 }
      ])

      expect(collectionOfObjects.mode('foo')).toEqual([1])

      const collectionOfObjects2 = collect([
        { foo: 1 },
        { foo: 3 },
        { foo: 3 },
        { foo: 6 },
        { foo: 7 },
        { foo: 8 },
        { foo: 9 }
      ])

      expect(collectionOfObjects2.mode('foo')).toEqual([3])
    })

    it('should return the mode value of collection values by nested key', () => {
      const collectionOfObjects = collect([
        { foo: { bar: 1 } },
        { foo: { bar: 1 } },
        { foo: { bar: 2 } },
        { foo: { bar: 4 } }
      ])

      expect(collectionOfObjects.mode('foo.bar')).toEqual([1])
    })

    it('should return array with multiple values if necessary', () => {
      const collectionOfObjects = collect([{ foo: 1 }, { foo: 2 }, { foo: 3 }])
      const collectionOfObjects2 = collect([
        { foo: 1 },
        { foo: 1 },
        { foo: 2 },
        { foo: 4 },
        { foo: 4 }
      ])

      expect(collectionOfObjects.mode('foo')).toEqual([1, 2, 3])
      expect(collectionOfObjects2.mode('foo')).toEqual([1, 4])
    })

    it('should return null if collection is empty', () => {
      const collectionOfObjects = collect([])

      expect(collectionOfObjects.mode('foo')).toBeNull()
    })
  })

  describe('nth()', () => {
    const data = [
      {
        letter: 'a'
      },
      {
        letter: 'b'
      },
      {
        letter: 'c'
      },
      {
        letter: 'd'
      },
      {
        letter: 'e'
      },
      {
        letter: 'f'
      },
      {
        letter: 'g'
      },
      {
        letter: 'h'
      },
      {
        letter: 'i'
      }
    ]
    const collection = collect(data)

    it('should create a new collection consisting of every n-th element', () => {
      const nth4 = collection.nth(4)
      expect(nth4).toEqual([
        {
          letter: 'a'
        },
        {
          letter: 'e'
        },
        {
          letter: 'i'
        }
      ])
    })

    it('should return all items when receiving 1 as the first argument', () => {
      const nth1 = collection.nth(1)
      expect(nth1).toEqual(data)
    })

    it('should accept offset as the second argument', () => {
      const nth4offset1 = collection.nth(4, 1)
      expect(nth4offset1).toEqual([
        {
          letter: 'b'
        },
        {
          letter: 'f'
        }
      ])

      const nth4offset3 = collection.nth(4, 3)
      expect(nth4offset3).toEqual([
        {
          letter: 'd'
        },
        {
          letter: 'h'
        }
      ])
    })
  })

  describe('partition()', () => {
    it('should separate elements that pass a given truth test from those that do not', () => {
      const data = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 }
      ]
      const collection = collect(data)

      const arr = collection.partition((item) => item.id < 3)

      expect(arr).toEqual([
        collect([{ id: 1 }, { id: 2 }]),
        collect([{ id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }])
      ])
      expect(arr[0]).toEqual([{ id: 1 }, { id: 2 }])
      expect(collection).toEqual(data)
    })
  })

  describe('pipe()', () => {
    it('should pass the collection to the given callback and return the result', () => {
      const collection = collect([{ value: 1 }, { value: 2 }, { value: 3 }])

      const piped = collection.pipe((c) => c.sum('value'))

      expect(piped).toEqual(6)
    })

    it('should not modify the original collection', () => {
      const data = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 }
      ]
      const collection = collect(data)

      const piped = collection.pipe((c) => c.partition((item) => item.id < 3))

      expect(piped).toEqual([
        collect([{ id: 1 }, { id: 2 }]),
        collect([{ id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }])
      ])

      expect(collection).toEqual(data)
    })
  })

  describe('pipeInto()', () => {
    class ResourceCollection {
      public collection: { name: string }[]

      constructor(collection: { name: string }[]) {
        this.collection = collection
      }
    }

    const collection = collect([{ name: 'Firmino' }, { name: 'Mané' }])

    it('should pipe into a class', () => {
      const data = collection.pipeInto(ResourceCollection)

      expect(data).toBeInstanceOf(ResourceCollection)
      expect(data.collection).toEqual(collection)
    })
  })

  describe('pluck()', () => {
    const products = [
      { product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
      { product: 'Door', price: '100' }
    ]
    const collection = collect(products)

    it('should retrieve all of the collection values for a given key', () => {
      const pluck = collection.pluck('product')

      expect(pluck).toEqual(['Desk', 'Chair', 'Bookcase', 'Door'])
      expect(collection).toEqual(products)
    })

    it('should return null when an object is missing the key', () => {
      const pluck = collection.pluck('manufacturer')

      expect(pluck).toEqual(['IKEA', 'Herman Miller', 'IKEA', null])
      expect(collection).toEqual(products)

      const nulls = collection.pluck('non existing key')
      expect(nulls).toEqual([null, null, null, null])
      expect(collection).toEqual(products)
    })

    it('should be able to pluck key and value pairs', () => {
      const pluck = collection.pluck('price', 'product')

      expect(pluck).toEqual({
        Desk: 200,
        Chair: 100,
        Bookcase: 150,
        Door: '100'
      })
    })

    it('should return an array when only plucking values', () => {
      const pluck = collection.pluck('product')

      expect(Array.isArray(pluck)).toBeTruthy()
    })

    it('should return an object when plucking key and value pairs', () => {
      const pluck = collection.pluck('price', 'product')

      expect(typeof pluck).toBe('object')
      expect(Array.isArray(pluck)).toBeFalsy()
    })

    it('should overwrite existing keys', () => {
      const pluck = collection.pluck('product', 'manufacturer')

      expect(pluck).toEqual({
        IKEA: 'Bookcase',
        'Herman Miller': 'Chair',
        '': 'Door'
      })
    })

    it('should use empty string as key if object is missing property', () => {
      const pluck = collection.pluck('product', 'manufacturer')
      const keys = Object.keys(pluck)

      expect(keys[2]).toEqual('')
      expect(pluck[keys[2]]).toEqual('Door')
    })

    it('should use null as value if value is missing', () => {
      const pluck = collection.pluck('manufacturer', 'product')

      expect(pluck['Door']).toBeNull()

      expect(pluck).toEqual({
        Desk: 'IKEA',
        Chair: 'Herman Miller',
        Bookcase: 'IKEA',
        Door: null
      })
    })

    it(
      'should use null as value if value is missing ' +
        'and use empty string as key if object is missing property',
      () => {
        const pluck = collection.pluck('manufacturer', 'manufacturer')

        expect(pluck['']).toBeNull()

        expect(pluck).toEqual({
          '': null,
          'Herman Miller': 'Herman Miller',
          IKEA: 'IKEA'
        })
      }
    )

    it('should not return null instead of 0', () => {
      const data = [
        { name: 'January', count: 0 },
        { name: 'February', count: 0 },
        { name: 'March', count: 1 },
        { name: 'April', count: 0 },
        { name: 'May', count: 2 },
        { name: 'June', count: 0 },
        { name: 'July', count: 0 },
        { name: 'August', count: 0 },
        { name: 'September', count: 0 },
        { name: 'October', count: 0 },
        { name: 'November', count: 0 },
        { name: 'December', count: 0 }
      ]

      expect(collect(data).pluck('count')).toEqual([
        0,
        0,
        1,
        0,
        2,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ])

      expect(collect(data).pluck('count', 'name')['January']).toBe(0)
    })

    it('should allow dot notation', () => {
      const users = collect([
        {
          name: 'John',
          roles: [
            {
              name: 'Editor'
            },
            {
              name: 'Admin'
            }
          ]
        }
      ])

      expect(users.pluck('roles.0.name')).toEqual(['Editor'])
      expect(users.pluck('roles.1.name')).toEqual(['Admin'])
    })

    it('should allow wildcard dot notation', () => {
      const users = collect([
        {
          name: 'John',
          roles: [
            {
              name: 'Editor'
            },
            {
              name: 'Admin'
            }
          ]
        }
      ])

      expect(users.pluck('*')).toEqual([
        [
          'John',
          [
            {
              name: 'Editor'
            },
            {
              name: 'Admin'
            }
          ]
        ]
      ])

      expect(users.pluck('roles.*.name')).toEqual([['Editor', 'Admin']])
    })

    it('should allow null as value in wildcard', () => {
      const users = collect([
        {
          name: 'John',
          roles: [
            {
              name: 'Editor'
            },
            {
              name: null
            }
          ]
        }
      ])

      expect(users.pluck('roles.*.name')).toEqual([['Editor', null]])
    })

    it('should allow undefined as value in wildcard', () => {
      const users = collect([
        {
          name: 'John',
          roles: [
            {
              name: 'Editor'
            },
            {
              name: undefined
            }
          ]
        }
      ])

      expect(users.pluck('roles.*.name')).toEqual([['Editor', undefined]])
    })

    it('should allow symbol as value in wildcard', () => {
      const symbol = Symbol('Foo')

      const users = collect([
        {
          name: 'John',
          roles: [
            {
              name: 'Editor'
            },
            {
              name: symbol
            }
          ]
        }
      ])

      expect(users.pluck('roles.*.name')).toEqual([['Editor', symbol]])
    })

    it('should allow multiple wildcards', () => {
      const users = collect([
        {
          name: 'John',
          roles: [
            {
              name: 'Editor'
            },
            {
              name: 'Admin'
            }
          ]
        }
      ])

      expect(users.pluck('*.*')).toEqual([
        [{ name: 'Editor' }, { name: 'Admin' }]
      ])

      expect(users.pluck('*.*.*')).toEqual([['Editor', 'Admin']])
    })

    it('should be able to pluck key and value pairs using wildcards', () => {
      const users = collect([
        {
          name: 'John',
          roles: [
            {
              name: 'Editor'
            },
            {
              name: 'Admin'
            }
          ]
        }
      ])

      expect(users.pluck('roles.*.name', 'name')).toEqual({
        John: ['Editor', 'Admin']
      })
    })

    it(
      'should be able to pluck key and value pairs using wildcards and ' +
        'use empty string as key if object is missing property',
      () => {
        const users = collect([
          {
            name: '',
            roles: [
              {
                name: 'Editor'
              },
              {
                name: 'Admin'
              }
            ]
          }
        ])

        expect(users.pluck('roles.*.name', 'name')).toEqual({
          '': ['Editor', 'Admin']
        })
      }
    )
  })

  describe('prepend()', function () {
    it('should prepend an item to the beginning of the collection', () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
      const collection = collect(data)

      expect(collection.prepend({ id: 0 })).toEqual([{ id: 0 }, ...data])
      expect(collection).toEqual([{ id: 0 }, ...data])
    })
  })

  describe('pull()', () => {
    const players = [
      {
        firstname: 'John',
        lastname: 'Doe'
      },
      {
        firstname: 'Joe',
        lastname: 'Doe'
      }
    ]

    it('should return the item at a given key and remove it from the collection', () => {
      const a = collect(players)
      const b = collect(players)

      expect(a.pull(0)?.firstname).toEqual('John')
      expect(a).toEqual([
        {
          firstname: 'Joe',
          lastname: 'Doe'
        }
      ])
      expect(b).toEqual(players)
    })

    it('should return null if the key does not exist', () => {
      const collection = collect(players)
      expect(collection.pull(2)).toBeNull()
    })
  })

  describe('put()', () => {
    const data = [
      { name: 'Alex Doe' },
      { name: 'Joe Doe' },
      { name: 'John Doe' }
    ]

    it('should set the given key and value in the collection', () => {
      const collection = collect(data)
      const modified = collection.put({ name: 'Mary Doe' }, 1)

      expect(collection).toEqual(modified)
      expect(collection).toEqual([
        { name: 'Alex Doe' },
        { name: 'Mary Doe' },
        { name: 'John Doe' }
      ])
    })

    it('should push the value into the collection if key was not provided', () => {
      const collection = collect(data)
      const modified = collection.put({ name: 'Mary Doe' })

      expect(collection).toEqual(modified)
      expect(collection).toEqual([...data, { name: 'Mary Doe' }])
    })
  })

  describe('random()', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]

    it('should return a random item from the collection', () => {
      const collection = collect(data)
      const random = collection.random()

      expect(random.id).toBeLessThanOrEqual(5)
      expect(collection).toHaveLength(5)
    })

    it('should return n random items from the collection', () => {
      const arrayOfRandomValues = collect(data).random(3)

      expect(arrayOfRandomValues).toHaveLength(3)
      expect(arrayOfRandomValues[0].id).toBeLessThanOrEqual(5)
      expect(arrayOfRandomValues[1].id).toBeLessThanOrEqual(5)
      expect(arrayOfRandomValues[2].id).toBeLessThanOrEqual(5)
      expect(arrayOfRandomValues[3]).toBeUndefined()
    })

    it('should return n random items from the collection, also when 1 is passed', () => {
      const arrayOfRandomValues = collect(data).random(1)

      expect(arrayOfRandomValues).toHaveLength(1)
      expect(arrayOfRandomValues[0].id).toBeLessThanOrEqual(5)
    })

    it('should not modify the collection', () => {
      const data2 = [...data, { id: 8 }, { id: 6 }]
      const collection = collect(data2)

      collection.random()

      expect(collection).toEqual(data2)
    })
  })

  describe('reject()', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]

    it('should filter the collection using the given callback. removing items that returns true in the callback', () => {
      const collection = collect(data)
      const filtered = collection.reject((item) => item.id > 2)

      expect(filtered).toEqual([{ id: 1 }, { id: 2 }])
      expect(collection).toEqual(data)
    })

    it('should not modify the collection', () => {
      const collection = collect([...data, { id: 5 }, { id: 6 }])
      const filtered = collection.reject((item) => item.id > 2)

      expect(filtered).toEqual([{ id: 1 }, { id: 2 }])
      expect(collection).toEqual([...data, { id: 5 }, { id: 6 }])
    })

    it('should do the exact opposite of filter', () => {
      const collection = collect(data)
      const filter = collection.filter((item) => item.id > 2)
      const reject = collection.reject((item) => item.id > 2)

      expect(filter).toEqual([{ id: 3 }, { id: 4 }])
      expect(reject).toEqual([{ id: 1 }, { id: 2 }])
    })
  })

  describe('search()', () => {
    it('should search the collection for the given value and returns its key if found', () => {
      const collection = collect([
        { id: 1, name: 'Test' },
        { id: 2, name: 'Test2' }
      ])

      expect(collection.search((item) => item.id > 1)).toEqual(1)
    })

    it('should return false if no items were found', () => {
      const collection = collect([
        { id: 1, name: 'Test' },
        { id: 2, name: 'Test2' }
      ])

      expect(collection.search((item) => item.id > 2)).toEqual(false)
    })
  })

  describe('shuffle()', () => {
    it('should shuffle the items in the collection', () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
      const collection = collect(data)
      const shuffled = collection.shuffle()

      expect(shuffled).toHaveLength(5)
      expect(shuffled[0].id).toBeLessThanOrEqual(5)
      expect(shuffled[1].id).toBeLessThanOrEqual(5)
      expect(shuffled[2].id).toBeLessThanOrEqual(5)
      expect(shuffled[3].id).toBeLessThanOrEqual(5)
      expect(shuffled[4].id).toBeLessThanOrEqual(5)

      expect(collection).toHaveLength(5)
      expect(collection.count()).toBe(5)
    })
  })

  describe('skip()', () => {
    it('should skip n number of items', () => {
      const collection = collect([
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 }
      ])

      expect(collection.skip(4)).toEqual([{ id: 5 }])
    })
  })

  describe('skipUntil()', () => {
    it('should skip all values before a given value appears', () => {
      const data = [
        { id: 1 },
        { id: 1 },
        { id: 2 },
        { id: 2 },
        { id: 3 },
        { id: 3 },
        { id: 4 },
        { id: 4 }
      ]
      const collection = collect(data)

      expect(collection.skipUntil({ id: 3 })).toEqual([
        { id: 3 },
        { id: 3 },
        { id: 4 },
        { id: 4 }
      ])
      expect(collection.skipUntil({ id: 1 })).toEqual(data)
    })

    it('should accept a callback', () => {
      const collection = collect([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])

      const subset = collection.skipUntil((item) => item.id >= 3)

      expect(subset).toEqual([{ id: 3 }, { id: 4 }])
    })
  })

  describe('skipWhile()', () => {
    it('should skip all values before a given value appears', () => {
      const data = [
        { id: 1 },
        { id: 1 },
        { id: 2 },
        { id: 2 },
        { id: 3 },
        { id: 3 },
        { id: 4 },
        { id: 4 }
      ]
      const collection = collect(data)

      expect(collection.skipWhile({ id: 1 })).toEqual([
        { id: 2 },
        { id: 2 },
        { id: 3 },
        { id: 3 },
        { id: 4 },
        { id: 4 }
      ])
    })

    it('should accept a callback', () => {
      const collection = collect([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])

      const subset = collection.skipWhile((item) => item.id <= 3)

      expect(subset).toEqual([{ id: 4 }])
    })
  })

  describe('sortBy()', () => {
    const data = [
      { name: 'Desk', price: 200 },
      { name: 'Chair', price: 100 },
      { name: 'Bookcase', price: 150 }
    ]

    it('should sort the collection by the given key', () => {
      const collection = collect(data)
      const sorted = collection.sortBy('price')

      expect(sorted).toEqual([
        { name: 'Chair', price: 100 },
        { name: 'Bookcase', price: 150 },
        { name: 'Desk', price: 200 }
      ])
    })

    it('should not modify the collection', () => {
      const collection = collect(data)
      const sorted = collection.sortBy('price')

      expect(sorted).toEqual([
        { name: 'Chair', price: 100 },
        { name: 'Bookcase', price: 150 },
        { name: 'Desk', price: 200 }
      ])
      expect(collection).toEqual(data)
    })

    it('should accept a custom sort function', () => {
      const collection = collect([
        { name: 'Desk', colors: ['Black', 'Mahogany'] },
        { name: 'Chair', colors: ['Black'] },
        { name: 'Bookcase', colors: ['Red', 'Beige', 'Brown'] }
      ])

      const sorted = collection.sortBy((product) => product.colors.length)

      expect(sorted).toEqual([
        { name: 'Chair', colors: ['Black'] },
        { name: 'Desk', colors: ['Black', 'Mahogany'] },
        { name: 'Bookcase', colors: ['Red', 'Beige', 'Brown'] }
      ])

      expect(collection).toEqual([
        { name: 'Desk', colors: ['Black', 'Mahogany'] },
        { name: 'Chair', colors: ['Black'] },
        { name: 'Bookcase', colors: ['Red', 'Beige', 'Brown'] }
      ])
    })

    it('should sort strings before integers and integers before null', () => {
      const collection1 = collect([
        { order: '1971-11-13T23:00:00.000000Z' },
        { order: null },
        { order: 1 }
      ])
      const collection2 = collect([
        { order: '1' },
        { order: null },
        { order: 1 }
      ])

      const sorted1 = collection1.sortBy('order')
      const sorted2 = collection2.sortBy('order')

      expect(sorted1).toEqual([
        { order: '1971-11-13T23:00:00.000000Z' },
        { order: 1 },
        { order: null }
      ])
      expect(sorted2).toEqual([{ order: '1' }, { order: 1 }, { order: null }])
    })

    it('should sort strings before integers and integers before null when using a callback function', () => {
      const collection = collect([
        { order: '1971-11-13T23:00:00.000000Z' },
        { order: null },
        { order: 1 }
      ])

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const sorted = collection.sortBy((item) => item.order)

      expect(sorted).toEqual([
        { order: '1971-11-13T23:00:00.000000Z' },
        { order: 1 },
        { order: null }
      ])
    })

    it('should sort nested data with dot notation', () => {
      const collection = collect([
        { nested: { data: '1971-11-13T23:00:00.000000Z' } },
        { nested: { data: null } },
        { nested: { data: 1 } }
      ])

      const sorted = collection.sortBy('nested.data')

      expect(sorted).toEqual([
        { nested: { data: '1971-11-13T23:00:00.000000Z' } },
        { nested: { data: 1 } },
        { nested: { data: null } }
      ])
    })
  })

  describe('sortByDesc()', () => {
    it('should reverse sort the collection by the given key', () => {
      const collection = collect([
        { name: 'Desk', price: 200 },
        { name: 'Chair', price: 100 },
        { name: 'Bookcase', price: 150 }
      ])

      const sorted = collection.sortByDesc('price')

      expect(sorted).toEqual([
        { name: 'Desk', price: 200 },
        { name: 'Bookcase', price: 150 },
        { name: 'Chair', price: 100 }
      ])
    })

    it('should accept a custom sort function', () => {
      const collection2 = collect([
        { name: 'Bookcase', colors: ['Red', 'Beige', 'Brown'] },
        { name: 'Chair', colors: ['Black'] },
        { name: 'Desk', colors: ['Black', 'Mahogany'] }
      ])

      const sorted2 = collection2.sortByDesc((product) => product.colors.length)

      expect(sorted2).toEqual([
        { name: 'Bookcase', colors: ['Red', 'Beige', 'Brown'] },
        { name: 'Desk', colors: ['Black', 'Mahogany'] },
        { name: 'Chair', colors: ['Black'] }
      ])

      expect(collection2).toEqual([
        { name: 'Bookcase', colors: ['Red', 'Beige', 'Brown'] },
        { name: 'Chair', colors: ['Black'] },
        { name: 'Desk', colors: ['Black', 'Mahogany'] }
      ])
    })
  })

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

  describe('sum()', () => {
    it('should return the sum of collection values by key', () => {
      const collection = collect([
        { name: 'JavaScript The Good Parts', pages: 176 },
        { name: 'JavaScript The Definitive Guide', pages: 1096 }
      ])

      expect(collection.sum('pages')).toEqual(1272)
    })

    it('should return the sum of the provided closure', () => {
      const data = [
        { name: 'Desk', colors: ['Black', 'Mahogany'] },
        { name: 'Chair', colors: ['Black'] },
        { name: 'Bookcase', colors: ['Red', 'Beige', 'Brown'] }
      ]
      const collection = collect(data)

      const summed = collection.sum((product) => product.colors.length)

      expect(summed).toEqual(6)

      expect(collection).toEqual(data)
    })

    it('should parse the return value of closure when return string', () => {
      const data = [
        { name: 'Desk', colors: ['Black', 'Mahogany'] },
        { name: 'Chair', colors: ['Black'] },
        { name: 'Bookcase', colors: ['Red', 'Beige', 'Brown'] }
      ]
      const collection = collect(data)

      const summed = collection.sum((product) =>
        product.colors.length.toString()
      )

      expect(summed).toEqual(6)

      expect(collection).toEqual(data)
    })

    it('should strip a number to nearest right number', () => {
      const collection1 = collect([{ value: 0.1 }, { value: 0.2 }])
      const collection2 = collect([{ value: 1.0 - 0.9 }])

      expect(collection1.sum('value')).toEqual(0.3)
      expect(collection2.sum('value')).toEqual(0.1)
    })

    it('should parse strings to numbers', () => {
      const collection1 = collect([{ value: '5' }, { value: '5' }])
      const collection2 = collect([{ value: '0.1' }, { value: '0.2' }])
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const collection3 = collect([{ value: '1.0' - '0.9' }])
      const collection4 = collect([
        { name: 'Desk', colors: ['Black', 'Mahogany'] },
        { name: 'Chair', colors: ['Black'] },
        { name: 'Bookcase', colors: ['Red', 'Beige', 'Brown'] }
      ])

      expect(collection1.sum('value')).toEqual(10)
      expect(collection2.sum('value')).toEqual(0.3)
      expect(collection3.sum('value')).toEqual(0.1)
      expect(
        collection4.sum((product) => product.colors.length.toString())
      ).toEqual(6)
    })
  })

  describe('take()', () => {
    const data = [
      { id: 0 },
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 }
    ]

    it('should return a new collection with the specified number of items', () => {
      const collection = collect(data)
      const chunk = collection.take(3)

      expect(chunk).toEqual([{ id: 0 }, { id: 1 }, { id: 2 }])
      expect(collection).toEqual(data)
    })

    it('should take from the end of the collection when passed a negative integer', () => {
      const collection = collect(data)
      const chunk = collection.take(-2)

      expect(chunk).toEqual([{ id: 4 }, { id: 5 }])
      expect(collection).toEqual(data)
    })
  })

  describe('takeUntil()', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]

    it('should take values', () => {
      const collection = collect(data)

      expect(collection.takeUntil(data[2])).toEqual([{ id: 1 }, { id: 2 }])

      expect(collection.takeUntil(data[0])).toEqual([])
    })

    it('should accept a callback', () => {
      const collection = collect(data)

      const subset = collection.takeUntil((item) => item.id >= 3)

      expect(subset).toEqual([{ id: 1 }, { id: 2 }])
    })
  })

  describe('takeWhile()', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]

    it('should take values', () => {
      const collection = collect(data)

      expect(collection.takeWhile(data[0])).toEqual([{ id: 1 }])

      expect(collection.takeWhile(data[1])).toEqual([])
    })

    it('should accept a callback', () => {
      const collection = collect(data)

      const subset = collection.takeWhile((item) => item.id < 3)

      expect(subset).toEqual([{ id: 1 }, { id: 2 }])
    })
  })

  describe('tap()', () => {
    it('should pass the collection to the given callback', () => {
      let tapped = null
      const number = collect([
        { id: 2 },
        { id: 4 },
        { id: 3 },
        { id: 1 },
        { id: 5 }
      ])
        .sortBy('id')
        .tap((collection) => {
          tapped = collection
        })
        .shift()

      expect(tapped).toEqual([{ id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }])
      expect(number).toEqual({ id: 1 })
    })
  })

  describe('toArray()', () => {
    it('should convert the collection into a standard array', () => {
      const data = [
        { name: 'Desk', price: 200 },
        { name: 'Chair', price: 100 },
        { name: 'Bookcase', price: 150 }
      ]
      const collection = collect(data)
      const array = collection.toArray()

      expect(array).toEqual(data)
      expect(array).toBeInstanceOf(Array)
      expect(array).not.toBeInstanceOf(Collection)
    })
  })

  describe('toJson()', () => {
    const data = [
      { name: 'Desk', price: 200 },
      { name: 'Chair', price: 100 },
      { name: 'Bookcase', price: 150 }
    ]

    it('should convert the collection into JSON string', () => {
      const collection = collect(data)

      expect(collection.toJson()).toEqual(
        '[{"name":"Desk","price":200},{"name":"Chair","price":100},{"name":"Bookcase","price":150}]'
      )
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

    it('should filter the collection by a given key/value pair', () => {
      const filtered = collection.where('price', 100)

      expect(filtered).toEqual([
        { product: 'Chair', price: 100, manufacturer: 'Herman Miller' }
      ])
      expect(collection).toEqual(products)
    })

    it('should return everything that matches', () => {
      const filtered = collection.where('manufacturer', 'IKEA')

      expect(filtered).toEqual([
        { product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
      ])
      expect(collection).toEqual(products)
    })

    it('should accept a custom operator: less than', () => {
      const under200 = collection.where('price', '<', 150)

      expect(under200).toEqual([
        { product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { product: 'Door', price: '100' }
      ])
    })

    it('should accept a custom operator: less than or equal to', () => {
      const overOrExactly150 = collection.where('price', '<=', 150)

      expect(overOrExactly150).toEqual([
        { product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
        { product: 'Door', price: '100' }
      ])
    })

    it('should accept a custom operator: bigger than', () => {
      const over150 = collection.where('price', '>', 150)

      expect(over150).toEqual([
        { product: 'Desk', price: 200, manufacturer: 'IKEA' }
      ])
    })

    it('should accept a custom operator: bigger than or equal to', () => {
      const overOrExactly150 = collection.where('price', '>=', 150)

      expect(overOrExactly150).toEqual([
        { product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
      ])
    })

    it('should accept a custom operator: loosely equal', () => {
      const loosly100 = collection.where('price', '==', 100)

      expect(loosly100).toEqual([
        { product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { product: 'Door', price: '100' }
      ])
    })

    it('should accept a custom operator: strictly not equal', () => {
      const not100 = collection.where('price', '!==', 100)

      expect(not100).toEqual([
        { product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { product: 'Bookcase', price: 150, manufacturer: 'IKEA' },
        { product: 'Door', price: '100' }
      ])
    })

    it('should accept a custom operator: loosely not equal', () => {
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

    it('should use default operator (strictly equal) when an invalid operator was provided', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const filtered = collection.where('manufacturer', '====', 'IKEA')

      expect(filtered).toEqual([
        { product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
      ])
      expect(collection).toEqual(products)
    })

    it('should work with nested objects', () => {
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

    it('should work when only passing one argument', () => {
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

    it('should work when passing two argument', () => {
      const hasManufacturer = collection.where('manufacturer', true)

      expect(hasManufacturer).toEqual([
        { product: 'Desk', price: 200, manufacturer: 'IKEA' },
        { product: 'Chair', price: 100, manufacturer: 'Herman Miller' },
        { product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
      ])

      const dontHaveManufacturer = collection.where('manufacturer', false)

      expect(dontHaveManufacturer).toEqual([{ product: 'Door', price: '100' }])
    })

    it('should work with nested properties', () => {
      const collection2 = collect([
        { name: { firstname: 'Mohamed', lastname: 'Salah' } },
        { name: { firstname: 'Sadio', lastname: 'Mané' } },
        { name: { firstname: 'Roberto', lastname: 'Firmino' } }
      ])

      expect(collection2.where('name.lastname', 'Mané')).toEqual([
        { name: { firstname: 'Sadio', lastname: 'Mané' } }
      ])
    })

    it('should throw an error when key is not an string', () => {
      const errorModel = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        collection.where(100, 100)
      }

      expect(errorModel).toThrow('KEY must be an string.')
    })
  })
})
