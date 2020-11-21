import clone from '../src/helpers/clone'
import getDefaultValue from '../src/helpers/getDefaultValue'
import getProp from '../src/helpers/getProp'
import getValueFromItem from '../src/helpers/getValueFromItem'
import {
  isArray,
  isFunction,
  isNumber,
  isObject,
  isString
} from '../src/helpers/is'
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

  describe('getDefaultValue()', () => {
    it('should return the default value of the given value', () => {
      const closure = () => ({})
      const value = null

      expect(getDefaultValue(closure)).toStrictEqual({})
      expect(getDefaultValue(value)).toBeNull()
    })
  })

  describe('getValueFromItem()', () => {
    it('should return the value of the given key of the item', () => {
      expect(getValueFromItem({ id: 1, name: 'Joe Doe' }, 'name')).toBe(
        'Joe Doe'
      )
    })

    it('should return the value of the given callback', () => {
      expect(
        getValueFromItem({ id: 1, name: 'Joe Doe' }, (item) => item.name)
      ).toBe('Joe Doe')
    })

    it('should be able to access index in callback when provided', () => {
      expect(
        getValueFromItem(
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
})
