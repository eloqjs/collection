import { collect } from '../../src'

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
