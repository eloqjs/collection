import { collect } from '../../src'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { hoax } from '../utils'

describe('dump()', () => {
  it('should console log the collection', () => {
    const mockConsole = hoax(console, 'log')
    const collection = collect([{ id: 1 }, { id: 2 }, { id: 3 }])

    collection.dump()

    mockConsole.reset()

    expect(mockConsole.calls).toEqual([[collection]])
  })
})
