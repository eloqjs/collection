import { collect } from '../../src'

describe('wrap()', () => {
  const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]

  it('should wrap into collection', () => {
    const collection = collect().wrap(data)
    expect(collection).toEqual(data)
  })

  it('should not re-wrap a collection', () => {
    const collection = collect().wrap(collect(data))
    expect(collection).toEqual(data)
  })
})
