import { collect } from '../../src'

describe('mapWithKeys()', () => {
  it('should return an object containing a single key / value pair:', () => {
    const employees = [
      {
        name: 'John',
        department: 'Sales',
        email: 'john@example.com'
      },
      {
        name: 'Jane',
        department: 'Marketing',
        email: 'jane@example.com'
      }
    ]

    const collection = collect(employees)

    const keyed = collection.mapWithKeys((item) => [item.email, item.name])

    expect(keyed).toEqual({
      'john@example.com': 'John',
      'jane@example.com': 'Jane'
    })

    expect(collection).toEqual(employees)
  })
})
