import { collect } from '../../src'

describe('isEmpty()', () => {
  it('should return true if collection is empty', () => {
    expect(collect().isEmpty()).toBeTruthy()
    expect(collect([]).isEmpty()).toBeTruthy()
  })

  it('should return false if collection is not empty', () => {
    expect(collect({ key: 'value' }).isEmpty()).toBeFalsy()
  })
})
