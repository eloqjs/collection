import { collect } from '../../src'

describe('mode()', () => {
  it('should return the mode value of collection values by key', () => {
    const collectionOfObjects = collect([
      { foo: 1 },
      { foo: 1 },
      { foo: 2 },
      { foo: 4 }
    ])

    expect(collectionOfObjects.mode('foo')).toEqual([1])

    const collectionOfObjects2 = collect([
      { foo: 1 },
      { foo: 3 },
      { foo: 3 },
      { foo: 6 },
      { foo: 7 },
      { foo: 8 },
      { foo: 9 }
    ])

    expect(collectionOfObjects2.mode('foo')).toEqual([3])
  })

  it('should return the mode value of collection values by nested key', () => {
    const collectionOfObjects = collect([
      { foo: { bar: 1 } },
      { foo: { bar: 1 } },
      { foo: { bar: 2 } },
      { foo: { bar: 4 } }
    ])

    expect(collectionOfObjects.mode('foo.bar')).toEqual([1])
  })

  it('should return array with multiple values if necessary', () => {
    const collectionOfObjects = collect([{ foo: 1 }, { foo: 2 }, { foo: 3 }])
    const collectionOfObjects2 = collect([
      { foo: 1 },
      { foo: 1 },
      { foo: 2 },
      { foo: 4 },
      { foo: 4 }
    ])

    expect(collectionOfObjects.mode('foo')).toEqual([1, 2, 3])
    expect(collectionOfObjects2.mode('foo')).toEqual([1, 4])
  })

  it('should return null if collection is empty', () => {
    const collectionOfObjects = collect([])

    expect(collectionOfObjects.mode('foo')).toBeNull()
  })
})
