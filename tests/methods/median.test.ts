import { collect } from '../../src'

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
