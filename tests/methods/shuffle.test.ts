import { collect } from '../../src'

describe('shuffle()', () => {
  it('should shuffle the items in the collection', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
    const collection = collect(data)
    const shuffled = collection.shuffle()

    expect(shuffled).toHaveLength(5)
    expect(shuffled[0].id).toBeLessThanOrEqual(5)
    expect(shuffled[1].id).toBeLessThanOrEqual(5)
    expect(shuffled[2].id).toBeLessThanOrEqual(5)
    expect(shuffled[3].id).toBeLessThanOrEqual(5)
    expect(shuffled[4].id).toBeLessThanOrEqual(5)

    expect(collection).toHaveLength(5)
    expect(collection.count()).toBe(5)
  })
})
