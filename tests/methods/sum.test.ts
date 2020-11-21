import { collect } from '../../src'

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

    const summed = collection.sum((product) => product.colors.length.toString())

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
