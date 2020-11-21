import { collect } from '../../src'

describe('prepend()', function () {
  it('should prepend an item to the beginning of the collection', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
    const collection = collect(data)

    expect(collection.prepend({ id: 0 })).toEqual([{ id: 0 }, ...data])
    expect(collection).toEqual([{ id: 0 }, ...data])
  })
})
