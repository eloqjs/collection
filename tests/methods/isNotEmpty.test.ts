import { collect } from '../../src'

describe('isNotEmpty()', () => {
  it('should return false if collection is empty', () => {
    expect(collect().isNotEmpty()).toBeFalsy()
    expect(collect([]).isNotEmpty()).toBeFalsy()
  })

  it('should return true if collection is not empty', () => {
    expect(collect({ key: 'value' }).isNotEmpty()).toBeTruthy()
  })
})
