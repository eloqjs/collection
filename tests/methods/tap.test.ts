import { collect } from '../../src'

describe('tap()', () => {
  it('should pass the collection to the given callback', () => {
    let tapped = null
    const number = collect([
      { id: 2 },
      { id: 4 },
      { id: 3 },
      { id: 1 },
      { id: 5 }
    ])
      .sortBy('id')
      .tap((collection) => {
        tapped = collection
      })
      .shift()

    expect(tapped).toEqual([{ id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }])
    expect(number).toEqual({ id: 1 })
  })
})
