import { collect } from '../../src'

describe('min()', () => {
  it('should return the minimum value of a given key', () => {
    const data = [
      {
        worth: 100
      },
      {
        worth: 900
      },
      {
        worth: 79
      },
      {
        worth: undefined
      },
      {
        unicorn: false
      }
    ]

    const collection = collect(data)
    const minKey = collection.min('worth')
    expect(minKey).toEqual(79)
    expect(collection).toEqual(data)
  })

  it('should return the minimum value of a given nested key', () => {
    const data = [
      {
        foo: {
          worth: 100
        }
      },
      {
        foo: {
          worth: 900
        }
      },
      {
        foo: {
          worth: 79
        }
      },
      {
        foo: {
          worth: undefined
        }
      },
      {
        unicorn: false
      }
    ]

    const collection = collect(data)
    const minKey = collection.min('foo.worth')
    expect(minKey).toEqual(79)
    expect(collection).toEqual(data)
  })

  it('should work with negative values', () => {
    const data = [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
      { value: -5 },
      { value: -4 },
      { value: -3 },
      { value: -2 },
      { value: -1 }
    ]
    const collection = collect(data)
    const min = collection.min('value')

    expect(collection).toEqual(data)
    expect(min).toEqual(-5)
  })
})
