import { collect } from '../../src'

describe('dd()', () => {
  it('should dump the collection and exit the current process', () => {
    const consoleSpy = jest
      .spyOn(console, 'log')
      .mockImplementation((message) => message)
    const mockExit = jest
      .spyOn(process, 'exit')
      .mockImplementation((code?: number) => code as never)
    const collection = collect([{ id: 1 }, { id: 2 }, { id: 3 }])

    collection.dd()

    expect(consoleSpy).toHaveBeenCalledWith(collection)
    expect(mockExit).toHaveBeenCalledWith(1)
  })
})
