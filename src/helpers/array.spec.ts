import { isArray, ArrayOptions } from '..'
import { expect } from 'chai'
import { Validator, ValueValidator } from '../types'
import { isString } from './string'

interface Test {
  it: string
  validator: Validator | ValueValidator<any>
  value: any
  expected: true | undefined
  opts?: ArrayOptions
}
const tests: Test[] = [
  {
    it: 'return the array',
    validator: { value: isString },
    value: [{ value: 'string' }],
    expected: true
  },
  {
    it: 'return not the array when all members fail',
    validator: { value: isString },
    value: [{ value: 42 }],
    expected: undefined
  },
  {
    it: 'return not the array when one member fail',
    validator: { value: isString },
    value: [{ value: '42' }, { value: 42 }],
    expected: undefined
  },
  {
    it: 'validates members that are primitives',
    validator: isString,
    value: ['string'],
    expected: true
  },
  {
    it: 'rejects members that a primitives that fail validation',
    validator: isString,
    value: [42],
    expected: undefined
  }
]

describe('isArray()', () => {
  for (const test of tests) {
    it(`will ${test.it}`, () => {
      const actual = isArray(test.value, { validator: test.validator })

      if (test.expected) {
        expect(actual).to.exist
        return
      }
      expect(actual).to.not.exist
    })
  }
})
