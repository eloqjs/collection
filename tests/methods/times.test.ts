import { collect } from '../../src'

describe('times()', () => {
  it('should create a new collection by invoking the callback a given amount of times', () => {
    const collection = collect().times(10, (number) => ({
      id: number * 9
    }))

    expect(collection).toEqual([
      { id: 9 },
      { id: 18 },
      { id: 27 },
      { id: 36 },
      { id: 45 },
      { id: 54 },
      { id: 63 },
      { id: 72 },
      { id: 81 },
      { id: 90 }
    ])
  })
})
