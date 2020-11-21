import { collect } from '../../src'

describe('count()', () => {
  it('should return the number of items in the collection', () => {
    const array = [{ id: 1 }]

    expect(collect(array).count()).toBe(1)

    array.push({ id: 2 })

    expect(collect(array).count()).toBe(2)

    array.push({ id: 3 })

    expect(collect(array).count()).toBe(3)
  })
})
