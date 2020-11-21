import { collect } from '../../src'

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
    const first = collection.first() as { name: string; number: number }

    expect(collection.contains(first)).toBeTruthy()
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
