import { collect } from '../../src'

describe('forget()', () => {
  it('should delete by index', () => {
    const collection = collect([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 }
    ])
    const forget = collection.forget(2)

    expect(forget).toEqual([{ id: 1 }, { id: 2 }, { id: 4 }, { id: 5 }])
    expect(collection).toEqual([{ id: 1 }, { id: 2 }, { id: 4 }, { id: 5 }])
  })
})
