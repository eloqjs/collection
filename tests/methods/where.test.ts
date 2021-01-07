import { collect } from '../../src'

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

  it('should accept a custom operator: LIKE; starts with (value%)', () => {
    const filtered = collection.where('manufacturer', 'LIKE', 'IK%')

    expect(filtered).toEqual([
      { product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
    expect(collection).toEqual(products)
  })

  it('should accept a custom operator: LIKE; ends with (%value)', () => {
    const filtered = collection.where('manufacturer', 'LIKE', '%ler')

    expect(filtered).toEqual([
      { product: 'Chair', price: 100, manufacturer: 'Herman Miller' }
    ])
    expect(collection).toEqual(products)
  })

  it('should accept a custom operator: LIKE; any position (%value%)', () => {
    const filtered = collection.where('manufacturer', 'LIKE', '%KE%')

    expect(filtered).toEqual([
      { product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
    expect(collection).toEqual(products)
  })

  it('should accept a custom operator: LIKE; second position (_value%)', () => {
    const filtered = collection.where('manufacturer', 'LIKE', '_KE%')

    expect(filtered).toEqual([
      { product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
    expect(collection).toEqual(products)
  })

  it('should accept a custom operator: LIKE; starts with and are at least 2 characters in length (value_%)', () => {
    const filtered = collection.where('manufacturer', 'LIKE', 'IK_%')

    expect(filtered).toEqual([
      { product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
    expect(collection).toEqual(products)
  })

  it('should accept a custom operator: LIKE; starts with and are at least 3 characters in length (value__%)', () => {
    const filtered = collection.where('manufacturer', 'LIKE', 'IK__%')

    expect(filtered).toEqual([
      { product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
    expect(collection).toEqual(products)
  })

  it('should accept a custom operator: LIKE; starts with and ends with', () => {
    const filtered = collection.where('manufacturer', 'LIKE', 'I%A')

    expect(filtered).toEqual([
      { product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
    expect(collection).toEqual(products)
  })

  it('should accept a custom operator: LIKE; should use default operator (any position) when an invalid operator was provided', () => {
    const filtered = collection.where('manufacturer', 'LIKE', 'IK')

    expect(filtered).toEqual([
      { product: 'Desk', price: 200, manufacturer: 'IKEA' },
      { product: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
    expect(collection).toEqual(products)
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

  it('should work when items are wrapped in "data" key', () => {
    const collection2 = collect([
      { data: { name: { firstname: 'Mohamed', lastname: 'Salah' } } },
      { data: { name: { firstname: 'Sadio', lastname: 'Mané' } } },
      { data: { name: { firstname: 'Roberto', lastname: 'Firmino' } } }
    ])

    expect(collection2.where('name.lastname', 'Mané')).toEqual([
      { data: { name: { firstname: 'Sadio', lastname: 'Mané' } } }
    ])
  })
})
