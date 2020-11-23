import { collect } from '../../src'

describe('unless()', () => {
  it('should execute the given callback when the first argument given to the method evaluates to false', () => {
    const collection = collect([{ id: 1 }, { id: 2 }, { id: 3 }])

    collection.unless(false, (c) => {
      c.push({ id: 4 })
    })

    expect(collection).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])

    collection.unless(
      true,
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
})
