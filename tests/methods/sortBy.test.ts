import { collect } from '../../src'

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
    const collection2 = collect([{ order: '1' }, { order: null }, { order: 1 }])

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
