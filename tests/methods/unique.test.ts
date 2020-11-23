import { collect } from '../../src'

describe('unique()', () => {
  it('should return an array of unique objects by primary key', () => {
    const collection = collect([
      {
        id: 1,
        name: 'iPhone 6',
        brand: 'Apple',
        type: 'phone',
        price: 999
      },
      {
        id: 2,
        name: 'iPhone 5',
        brand: 'Apple',
        type: 'phone',
        price: '999'
      },
      {
        id: 3,
        name: 'Apple Watch',
        brand: 'Apple',
        type: 'watch',
        price: 1999
      },
      {
        id: 3,
        name: 'Galaxy S6',
        brand: 'Samsung',
        type: 'phone',
        price: 1999
      },
      {
        id: 1,
        name: 'Galaxy Gear',
        brand: 'Samsung',
        type: 'watch',
        price: 999
      }
    ])

    const unique = collection.unique()

    expect(unique).toEqual([
      {
        brand: 'Samsung',
        id: 1,
        name: 'Galaxy Gear',
        price: 999,
        type: 'watch'
      },
      {
        brand: 'Apple',
        id: 2,
        name: 'iPhone 5',
        price: '999',
        type: 'phone'
      },
      {
        brand: 'Samsung',
        id: 3,
        name: 'Galaxy S6',
        price: 1999,
        type: 'phone'
      }
    ])
  })

  it('should return an array of unique objects by key', () => {
    const collection = collect([
      {
        name: 'iPhone 6',
        brand: 'Apple',
        type: 'phone',
        price: 999
      },
      {
        name: 'iPhone 5',
        brand: 'Apple',
        type: 'phone',
        price: '999'
      },
      {
        name: 'Apple Watch',
        brand: 'Apple',
        type: 'watch',
        price: 1999
      },
      {
        name: 'Galaxy S6',
        brand: 'Samsung',
        type: 'phone',
        price: 1999
      },
      {
        name: 'Galaxy Gear',
        brand: 'Samsung',
        type: 'watch',
        price: 999
      }
    ])

    const unique = collection.unique('price')

    expect(unique).toEqual([
      {
        name: 'iPhone 6',
        brand: 'Apple',
        type: 'phone',
        price: 999
      },
      {
        name: 'iPhone 5',
        brand: 'Apple',
        type: 'phone',
        price: '999'
      },
      {
        name: 'Apple Watch',
        brand: 'Apple',
        type: 'watch',
        price: 1999
      }
    ])
  })

  it('should return an array of unique objects by callback', () => {
    const collection = collect([
      {
        name: 'iPhone 6',
        brand: 'Apple',
        type: 'phone',
        price: 999
      },
      {
        name: 'iPhone 5',
        brand: 'Apple',
        type: 'phone',
        price: '999'
      },
      {
        name: 'Apple Watch',
        brand: 'Apple',
        type: 'watch',
        price: 1999
      },
      {
        name: 'Galaxy S6',
        brand: 'Samsung',
        type: 'phone',
        price: 1999
      },
      {
        name: 'Galaxy Gear',
        brand: 'Samsung',
        type: 'watch',
        price: 999
      }
    ])

    const unique = collection.unique((item) => item.brand + item.price)

    expect(unique).toEqual([
      {
        name: 'iPhone 6',
        brand: 'Apple',
        type: 'phone',
        price: 999
      },
      {
        name: 'Apple Watch',
        brand: 'Apple',
        type: 'watch',
        price: 1999
      },
      {
        name: 'Galaxy S6',
        brand: 'Samsung',
        type: 'phone',
        price: 1999
      },
      {
        name: 'Galaxy Gear',
        brand: 'Samsung',
        type: 'watch',
        price: 999
      }
    ])
  })
})
