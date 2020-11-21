import { collect } from '../../src'

describe('random()', () => {
  const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]

  it('should return a random item from the collection', () => {
    const collection = collect(data)
    const random = collection.random() as { id: number }

    expect(random.id).toBeLessThanOrEqual(5)
    expect(collection).toHaveLength(5)
  })

  it('should return n random items from the collection', () => {
    const arrayOfRandomValues = collect(data).random(3)

    expect(arrayOfRandomValues).toHaveLength(3)
    expect(arrayOfRandomValues[0].id).toBeLessThanOrEqual(5)
    expect(arrayOfRandomValues[1].id).toBeLessThanOrEqual(5)
    expect(arrayOfRandomValues[2].id).toBeLessThanOrEqual(5)
    expect(arrayOfRandomValues[3]).toBeUndefined()
  })

  it('should return n random items from the collection, also when 1 is passed', () => {
    const arrayOfRandomValues = collect(data).random(1)

    expect(arrayOfRandomValues).toHaveLength(1)
    expect(arrayOfRandomValues[0].id).toBeLessThanOrEqual(5)
  })

  it('should not modify the collection', () => {
    const data2 = [...data, { id: 8 }, { id: 6 }]
    const collection = collect(data2)

    collection.random()

    expect(collection).toEqual(data2)
  })
})
