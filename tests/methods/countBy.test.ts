import { collect } from '../../src'

describe('countBy()', () => {
  it('should count occurrences based on the closure', () => {
    const collection = collect([
      { name: 'alice', email: 'alice@gmail.com' },
      { name: 'aaron', email: 'aaron@gmail.com' },
      { name: 'bob', email: 'bob@yahoo.com' },
      { name: 'carla', email: 'carlos@outlook.com' }
    ])

    const counted = collection.countBy((user) => user.email.split('@')[1])

    expect(counted).toEqual({
      'gmail.com': 2,
      'yahoo.com': 1,
      'outlook.com': 1
    })
  })
})
