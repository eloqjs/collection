import { collect } from '../../src'

describe('unwrap()', () => {
  it('should unwrap from collection to array', () => {
    expect(collect().unwrap(collect([{ name: 'Sadio Mané' }]))).toEqual([
      {
        name: 'Sadio Mané'
      }
    ])
  })

  it('should unwrap to array', () => {
    expect(collect().unwrap([{ foo: 'bar' }])).toEqual([{ foo: 'bar' }])
  })
})
