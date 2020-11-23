import { collect } from '../../src'

describe('mapToGroups()', () => {
  it('should map a collection to groups', () => {
    const data = collect([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
      { id: 4, name: 'B' }
    ])

    const groups = data.mapToGroups((item) => [item.name, item.id])

    expect(groups).toEqual({
      A: [1],
      B: [2, 4],
      C: [3]
    })
  })
})
