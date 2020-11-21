import { collect } from '../../src'

describe('max()', () => {
  it('should return the maximum value of a given key', () => {
    const data = [
      {
        value: 10
      },
      {
        value: -13
      },
      {
        value: 12
      },
      {
        value: undefined
      },
      {
        unicorn: false
      }
    ]
    const collection = collect(data)

    const max = collection.max('value')

    expect(max).toEqual(12)

    expect(collection).toEqual(data)
  })

  it('should return the maximum value of a given nested key', () => {
    const data = [
      {
        invoice: {
          value: 10
        }
      },
      {
        invoice: {
          value: -13
        }
      },
      {
        invoice: {
          value: 12
        }
      },
      {
        invoice: {
          value: undefined
        }
      },
      {
        unicorn: false
      }
    ]
    const collection = collect(data)

    const max = collection.max('invoice.value')

    expect(max).toEqual(12)

    expect(collection).toEqual(data)
  })
})
