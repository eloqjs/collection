import { collect } from '../../src'

describe('whereNull', () => {
  it('should remove all object where name is not null', () => {
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

    expect(collection.whereNull('name')).toEqual([{ name: null }])
  })
})
