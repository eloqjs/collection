import { collect } from '../../src'

describe('whereNotNull', () => {
  it('should remove all object where name is null', () => {
    const collection = collect([
      {
        name: 'Mohamed Salah'
      },
      {
        name: null
      },
      {
        name: 'Sadio Mané'
      }
    ])

    expect(collection.whereNotNull('name')).toEqual([
      {
        name: 'Mohamed Salah'
      },
      {
        name: 'Sadio Mané'
      }
    ])
  })
})
