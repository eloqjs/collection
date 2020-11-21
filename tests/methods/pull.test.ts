import { collect } from '../../src'

describe('pull()', () => {
  const players = [
    {
      id: 1,
      firstname: 'John',
      lastname: 'Doe'
    },
    {
      id: 2,
      firstname: 'Joe',
      lastname: 'Doe'
    }
  ]

  it('should return the item at a given primary key and remove it from the collection', () => {
    const a = collect(players)
    const b = collect(players)

    expect(a.pull(1)?.firstname).toEqual('John')
    expect(a).toEqual([
      {
        id: 2,
        firstname: 'Joe',
        lastname: 'Doe'
      }
    ])
    expect(b).toEqual(players)
  })

  it('should return null if the item does not exist', () => {
    const collection = collect(players)
    expect(collection.pull(3)).toBeNull()
  })
})
