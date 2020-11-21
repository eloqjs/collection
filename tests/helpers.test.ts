import clone from '../src/helpers/clone'
import getProp from '../src/helpers/getProp'
import getValue from '../src/helpers/getValue'
import {
  isArray,
  isFunction,
  isNumber,
  isObject,
  isString
} from '../src/helpers/is'
import resolveValue from '../src/helpers/resolveValue'
import { sortGreaterOrLessThan, sortNullish } from '../src/helpers/sort'
import variadic from '../src/helpers/variadic'
import { compareValues, whereHasValues } from '../src/helpers/where'

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
    const holder = {
      a: {
        b: {
          c: 1
        }
      }
    }

    it('should get property defined by dot notation in string.', () => {
      const result = getProp(holder, 'a.b.c')

      expect(result).toBe(1)
    })

    it('should get property defined by array-type keys.', () => {
      const result = getProp(holder, ['a', 'b', 'c'])

      expect(result).toBe(1)
    })

    it('should get property defined by simple string.', () => {
      const result = getProp(holder, 'a')

      expect(result).toBe(holder.a)
    })

    it('should return holder when key is not defined.', () => {
      const key = ''
      const result = getProp(holder, key)

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

  describe('getValue()', () => {
    it('should return the default value of the given value', () => {
      const closure = () => ({})
      const value = null

      expect(getValue(closure)).toStrictEqual({})
      expect(getValue(value)).toBeNull()
    })
  })

  describe('resolveValue()', () => {
    it('should return the value of the given key of the item', () => {
      expect(resolveValue({ id: 1, name: 'Joe Doe' }, 'name')).toBe('Joe Doe')
    })

    it('should return the value of the given callback', () => {
      expect(
        resolveValue({ id: 1, name: 'Joe Doe' }, (item) => item.name)
      ).toBe('Joe Doe')
    })

    it('should be able to access index in callback when provided', () => {
      expect(
        resolveValue(
          { id: 1, name: 'Joe Doe' },
          (item, index) => item.name + ' ' + index,
          1
        )
      ).toBe('Joe Doe 1')
    })
  })

  describe('compareValues()', () => {
    it('should compare two values', () => {
      expect(compareValues(1, 1, '===')).toBeTruthy()
      expect(compareValues(1, 2, '===')).toBeFalsy()
    })
  })

  describe('whereHasValues()', () => {
    it('should return a filtered collection of items, where each item has the given values', () => {
      const data = [
        { id: 1, product: 'Desk', price: 200 },
        { id: 2, product: 'Chair', price: 100 },
        { id: 3, product: 'Bookcase', price: 150 },
        { id: 4, product: 'Door', price: 100 }
      ]

      expect(whereHasValues(data, 'price', [100, 150])).toEqual([
        { id: 2, product: 'Chair', price: 100 },
        { id: 3, product: 'Bookcase', price: 150 },
        { id: 4, product: 'Door', price: 100 }
      ])
    })
  })

  describe('sortNullish()', () => {
    it('should return 0 when values are defined', () => {
      expect(sortNullish(1, 2)).toBe(0)
    })

    it('should return 1 when valueA is undefined or null', () => {
      expect(sortNullish(undefined, 2)).toBe(1)
      expect(sortNullish(null, 2)).toBe(1)
    })

    it('should return -1 when valueB is undefined or null', () => {
      expect(sortNullish(1, undefined)).toBe(-1)
      expect(sortNullish(1, null)).toBe(-1)
    })
  })

  describe('sortGreaterOrLessThan()', () => {
    it('should return 0 when valueA and valueB are equal', () => {
      expect(sortGreaterOrLessThan(1, 1)).toBe(0)
    })

    it('should return -1 when valueB is greater than valueA', () => {
      expect(sortGreaterOrLessThan(1, 2)).toBe(-1)
    })

    it('should return 1 when valueA is greater than valueB', () => {
      expect(sortGreaterOrLessThan(2, 1)).toBe(1)
    })
  })
})
