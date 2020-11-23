import { collect } from '../../src'

describe('partition()', () => {
  it('should separate elements that pass a given truth test from those that do not', () => {
    const data = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 }
    ]
    const collection = collect(data)

    const arr = collection.partition((item) => item.id < 3)

    expect(arr).toEqual([
      collect([{ id: 1 }, { id: 2 }]),
      collect([{ id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }])
    ])
    expect(arr[0]).toEqual([{ id: 1 }, { id: 2 }])
    expect(collection).toEqual(data)
  })
})
