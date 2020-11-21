import { collect } from '../../src'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { hoax } from '../utils'

describe('dd()', () => {
  it('should dump the collection and exit the current process', () => {
    const mockConsole = hoax(console, 'log')
    const mockProcess = hoax(process, 'exit')
    const collection = collect([{ id: 1 }, { id: 2 }, { id: 3 }])

    collection.dd()

    mockConsole.reset()
    mockProcess.reset()

    expect(mockConsole.calls).toEqual([[collection]])
    expect(mockProcess.calls).toEqual([[1]])
  })
})
