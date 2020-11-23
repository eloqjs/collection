import { collect } from '../../src'

describe('last()', () => {
  it('should return the last item from the collection', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
    const collection = collect(data)
    const last = collection.last()

    expect(last).toEqual({ id: 4 })
    expect(collection).toEqual(data)
  })

  it('should accept custom callback', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const collection = collect(data)
    const last = collection.last((item) => item.id > 1)

    expect(last).toEqual({ id: 3 })
    expect(collection).toEqual(data)
  })

  it('should return null when collection is empty', () => {
    expect(collect().last()).toBeNull()
  })
})
