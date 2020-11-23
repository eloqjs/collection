import { collect } from '../../src'

describe('toQuery()', () => {
  it('should return the first item in collection when getFresh() is not overridden', () => {
    const user = { id: 1, name: 'Joe Doe' }
    const collection = collect([user])

    expect(collection.toQuery()).toEqual(user)
  })

  it('should throw an error when collection is empty', () => {
    const collection = collect()
    const errorModel = () => {
      collection.toQuery()
    }

    expect(errorModel).toThrow('Unable to create query for empty collection.')
  })

  it('should throw an error when collection has mixed types', () => {
    class User {
      public id: number
      public name: string

      constructor(item: { id: number; name: string }) {
        this.id = item.id
        this.name = item.name
      }
    }

    class Post {
      public id: number
      public title: string

      constructor(item: { id: number; title: string }) {
        this.id = item.id
        this.title = item.title
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const collection = collect([
      new User({ id: 1, name: 'Joe Doe' }),
      new Post({ id: 2, title: 'Super Awesome' })
    ])
    const errorModel = () => {
      collection.toQuery()
    }

    expect(errorModel).toThrow(
      'Unable to create query for collection with mixed types.'
    )
  })
})
