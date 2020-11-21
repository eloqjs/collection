import { collect } from '../../src'

describe('keyBy', () => {
  const data = [
    {
      id: 100,
      product: 'Chair',
      manufacturer: 'IKEA',
      price: '1490 NOK'
    },
    {
      id: 150,
      product: 'Desk',
      manufacturer: 'IKEA',
      price: '900 NOK'
    },
    {
      id: 200,
      product: 'Chair',
      manufacturer: 'Herman Miller',
      price: '9990 NOK'
    }
  ]

  it('should key the collection by the given key', () => {
    const collection = collect(data)
    const keyed = collection.keyBy('manufacturer')

    expect(keyed).toEqual({
      IKEA: {
        id: 150,
        product: 'Desk',
        manufacturer: 'IKEA',
        price: '900 NOK'
      },
      'Herman Miller': {
        id: 200,
        product: 'Chair',
        manufacturer: 'Herman Miller',
        price: '9990 NOK'
      }
    })

    expect(collection).toEqual(data)
  })

  it('should key the collection by the given callback', () => {
    const collection = collect(data)
    const keyedUpperCase = collection.keyBy((item) =>
      item.manufacturer.toUpperCase()
    )

    expect(keyedUpperCase).toEqual({
      IKEA: {
        id: 150,
        product: 'Desk',
        manufacturer: 'IKEA',
        price: '900 NOK'
      },
      'HERMAN MILLER': {
        id: 200,
        product: 'Chair',
        manufacturer: 'Herman Miller',
        price: '9990 NOK'
      }
    })

    expect(collection).toEqual(data)
  })

  it('should only keep one items per key', () => {
    const collection = collect([
      {
        name: 'Sadio Mané',
        club: 'Liverpool FC'
      },
      {
        name: 'Roberto Firmino',
        club: 'Liverpool FC'
      },
      {
        name: 'Mohamed Salah',
        club: 'Liverpool FC'
      }
    ])

    const keyed = collection.keyBy('club')

    expect(keyed).toEqual({
      'Liverpool FC': {
        name: 'Mohamed Salah',
        club: 'Liverpool FC'
      }
    })
  })

  it('should key everything by an empty string if key does not exist', () => {
    const collection = collect(data)
    const keyed = collection.keyBy('xoxo')

    expect(keyed).toEqual({
      '': {
        id: 200,
        product: 'Chair',
        manufacturer: 'Herman Miller',
        price: '9990 NOK'
      }
    })

    expect(collection).toEqual(data)
  })

  it('should be able to use nested value as key', () => {
    const collection = collect([
      {
        name: 'Virgil van Dijk',
        club: {
          name: 'Liverpool FC'
        }
      },
      {
        name: 'Sadio Mané',
        club: {
          name: 'Liverpool FC'
        }
      }
    ])

    const keyed = collection.keyBy('club.name')

    expect(keyed['Liverpool FC']).toEqual({
      name: 'Sadio Mané',
      club: {
        name: 'Liverpool FC'
      }
    })
  })
})
