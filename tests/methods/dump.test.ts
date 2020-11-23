import { collect } from '../../src'

describe('dump()', () => {
  it('should console log the collection', () => {
    const consoleSpy = jest
      .spyOn(console, 'log')
      .mockImplementation((message) => message)
    const collection = collect([{ id: 1 }, { id: 2 }, { id: 3 }])

    collection.dump()

    expect(consoleSpy).toHaveBeenCalledWith(collection)
  })
})
