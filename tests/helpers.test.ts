import {
  clone,
  getProp,
  isArray,
  isFunction,
  isNumber,
  isObject,
  isString,
  variadic
} from '../src/helpers'

describe('Helpers', () => {
  describe('clone()', () => {
    it('should clone an Array', () => {
      const array = [{ foo: 'bar' }]

      expect(clone(array)).toEqual(array)
    })
  })

  /**
   * Tests of `getProp`
   * Based on tests from https://github.com/dy/dotprop (MIT)
   */
  describe('getProp()', () => {
    it('should get property defined by dot notation in string.', () => {
      const holder = {
        a: {
          b: {
            c: 1
          }
        }
      }

      const result = getProp(holder, 'a.b.c')

      expect(result).toBe(1)
    })

    it('should get property defined by array-type keys.', () => {
      const holder = {
        a: {
          b: {
            c: 1
          }
        }
      }

      const result = getProp(holder, ['a', 'b', 'c'])

      expect(result).toBe(1)
    })

    it('should get property defined by simple string.', () => {
      const holder = {
        a: {
          b: {
            c: 1
          }
        }
      }

      const result = getProp(holder, 'a')

      expect(result).toBe(holder.a)
    })

    it('should return holder when propName is not defined.', () => {
      const holder = {
        a: {
          b: {
            c: 1
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = getProp(holder)

      expect(result).toBe(holder)
    })
  })

  describe('variadic()', () => {
    it('should unwrap the Array', () => {
      const array = [{}, {}, {}]
      const wrappedArray = [array]

      expect(variadic(wrappedArray)).toEqual(array)
    })

    it('should return the Array itself', () => {
      const array = [{}, {}, {}]

      expect(variadic(array)).toEqual(array)
    })
  })

  describe('isArray()', () => {
    it('should return true if the passed value is an Array', () => {
      const array: unknown = []

      expect(isArray(array)).toBeTruthy()
    })

    it('should return false if the passed value is not an Array', () => {
      const func = () => true
      const object = {}
      const string = ''

      expect(isArray(func)).toBeFalsy()
      expect(isArray(object)).toBeFalsy()
      expect(isArray(string)).toBeFalsy()
    })
  })

  describe('isObject()', () => {
    it('should return true if the passed value is an Object', () => {
      const object = {}

      expect(isObject(object)).toBeTruthy()
    })

    it('should return false if the passed value is not an Object', () => {
      const array: unknown = []
      const func = () => true
      const number = 0
      const string = ''

      expect(isObject(array)).toBeFalsy()
      expect(isObject(func)).toBeFalsy()
      expect(isObject(number)).toBeFalsy()
      expect(isObject(string)).toBeFalsy()
    })
  })

  describe('isFunction()', () => {
    it('should return true if the passed value is a Function', () => {
      const func = () => true

      expect(isFunction(func)).toBeTruthy()
    })

    it('should return false if the passed value is not a Function', () => {
      const array: unknown = []
      const number = 0
      const object = {}
      const string = ''

      expect(isFunction(array)).toBeFalsy()
      expect(isFunction(number)).toBeFalsy()
      expect(isFunction(object)).toBeFalsy()
      expect(isFunction(string)).toBeFalsy()
    })
  })

  describe('isNumber()', () => {
    it('should return true if the passed value is a Number', () => {
      const number = 0

      expect(isNumber(number)).toBeTruthy()
    })

    it('should return false if the passed value is not a Number', () => {
      const array: unknown = []
      const func = () => true
      const object = {}
      const string = ''

      expect(isNumber(array)).toBeFalsy()
      expect(isNumber(func)).toBeFalsy()
      expect(isNumber(object)).toBeFalsy()
      expect(isNumber(string)).toBeFalsy()
    })
  })

  describe('isString()', () => {
    it('should return true if the passed value is a String', () => {
      const string = ''

      expect(isString(string)).toBeTruthy()
    })

    it('should return false if the passed value is not a String', () => {
      const array: unknown = []
      const func = () => true
      const number = 0
      const object = {}

      expect(isString(array)).toBeFalsy()
      expect(isString(func)).toBeFalsy()
      expect(isString(number)).toBeFalsy()
      expect(isString(object)).toBeFalsy()
    })
  })
})
