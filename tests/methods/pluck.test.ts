import { collect } from '../../src'

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
