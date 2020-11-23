import { collect } from '../../src'

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
