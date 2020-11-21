import { collect } from '../../src'

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