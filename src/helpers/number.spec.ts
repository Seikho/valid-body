import { isNumber, NumberOptions, OPTIONAL } from '..'
import { expect } from 'chai'

interface Test {
  it: string
  value: any
  expected: number | undefined | typeof OPTIONAL
  opts?: NumberOptions
}
const tests: Test[] = [
  {
    it: 'return undefined',
    value: 'string',
    expected: undefined
  },
  {
    it: 'return number when number provided',
    value: 42,
    expected: 42
  },
  {
    it: 'return number when string provided',
    value: '42',
    expected: 42
  },
  {
    it: 'return OPTIONAL symbol',
    value: undefined,
    expected: OPTIONAL,
    opts: { optional: true }
  }
]

describe('isString()', () => {
  for (const test of tests) {
    it(`will ${test.it}`, () => {
      const actual = isNumber(test.value, test.opts)
      expect(actual).to.equal(test.expected)
    })
  }
})
