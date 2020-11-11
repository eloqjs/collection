import {
  clone,
  isArray,
  isFunction,
  isObject,
  nestedValue,
  variadic
} from '../src/helpers'

describe('Helpers', () => {
  describe('clone()', () => {
    it('Should clone an Array', () => {
      const array = [{ foo: 'bar' }]

      expect(clone(array)).toEqual(array)
    })
  })

  describe('nestedValue()', () => {
    it('Should get value of a nested property', () => {
      const value = { foo: 'bar' }

      expect(nestedValue(value, 'foo')).toBe('bar')
    })

    it('Should get value of a deep nested property', () => {
      const value = { foo: { bar: 'baz' } }

      expect(nestedValue(value, 'foo.bar')).toBe('baz')
    })

    it('Should return the value itself if the value is not an Object', () => {
      const value = 'foo'

      expect(nestedValue(value, 'bar')).toBe('foo')
    })
  })

  describe('variadic()', () => {
    it('Should unwrap the Array', () => {
      const array = [{}, {}, {}]
      const wrappedArray = [array]

      expect(variadic(wrappedArray)).toEqual(array)
    })

    it('Should return the Array itself', () => {
      const array = [{}, {}, {}]

      expect(variadic(array)).toEqual(array)
    })
  })

  describe('isArray()', () => {
    it('Should return true if the passed value is an Array', () => {
      const array: unknown = []

      expect(isArray(array)).toBeTruthy()
    })

    it('Should return false if the passed value is not an Array', () => {
      const func = () => true
      const object = {}
      const string = ''

      expect(isArray(func)).toBeFalsy()
      expect(isArray(object)).toBeFalsy()
      expect(isArray(string)).toBeFalsy()
    })
  })

  describe('isObject()', () => {
    it('Should return true if the passed value is an Object', () => {
      const object = {}

      expect(isObject(object)).toBeTruthy()
    })

    it('Should return false if the passed value is not an Object', () => {
      const array: unknown = []
      const func = () => true
      const string = ''

      expect(isObject(array)).toBeFalsy()
      expect(isObject(func)).toBeFalsy()
      expect(isObject(string)).toBeFalsy()
    })
  })

  describe('isFunction()', () => {
    it('Should return true if the passed value is a Function', () => {
      const func = () => true

      expect(isFunction(func)).toBeTruthy()
    })

    it('Should return false if the passed value is not a Function', () => {
      const array: unknown = []
      const object = {}
      const string = ''

      expect(isFunction(array)).toBeFalsy()
      expect(isFunction(object)).toBeFalsy()
      expect(isFunction(string)).toBeFalsy()
    })
  })
})
