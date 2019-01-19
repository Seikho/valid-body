import { isString, StringOptions, OPTIONAL } from '..'
import { expect } from 'chai'

interface Test {
  it: string
  value: any
  expected: string | undefined | typeof OPTIONAL
  opts?: StringOptions
}
const tests: Test[] = [
  {
    it: 'return a string',
    value: 'string',
    expected: 'string'
  },
  {
    it: 'return undefined',
    value: 42,
    expected: undefined
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
      const actual = isString(test.value, test.opts)
      expect(actual).to.equal(test.expected)
    })
  }
})
