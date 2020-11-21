import { collect } from '../../src'

describe('when()', () => {
  const users = [{ name: 'michael' }, { name: 'tom' }]

  it('should execute the given callback when the first argument given to the method evaluates to true', () => {
    const collection = collect([{ id: 1 }, { id: 2 }, { id: 3 }])

    collection.when(true, (c) => {
      c.push({ id: 4 })
    })

    expect(collection).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])

    collection.when(
      false,
      (c) => {
        c.push({ id: 5 })
      },
      (c) => {
        c.push({ id: 6 })
      }
    )

    expect(collection).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 6 }
    ])
  })

  it('should pass the value over to the callback', () => {
    let collection = collect(users)

    collection.when('adam', (innerCollection, newName) =>
      innerCollection.push({ name: newName })
    )

    expect(collection).toEqual([...users, { name: 'adam' }])

    collection = collect(users)

    collection.when(false, (innerCollection, newName) =>
      innerCollection.push({ name: newName.toString() })
    )

    expect(collection).toEqual(users)
  })

  it('should call the default callback if the value is false', () => {
    const collection = collect(users)

    collection.when(
      false,
      (innerCollection) => innerCollection.push({ name: 'adam' }),
      (innerCollection) => innerCollection.push({ name: 'taylor' })
    )

    expect(collection).toEqual([...users, { name: 'taylor' }])
  })

  it('should return the collection', () => {
    const collection = collect(users)

    const newCollection = collection.when('adam', (innerCollection) =>
      innerCollection.push({ name: 'adam' })
    )

    expect(newCollection).toEqual(collection)
    expect(collection).toEqual([...users, { name: 'adam' }])
  })
})
