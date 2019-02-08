import { expect } from 'chai'
import { create, ValidatorMiddleware, wrap } from '.'
import { isString, isArray, isNumber } from './helpers'
import { Request, Response, NextFunction } from 'express'

interface Test {
  it: string
  body: any
  validator: ValidatorMiddleware
  isExpected?: (body: any) => boolean
  error?: boolean
}

const tests: Test[] = [
  {
    it: 'call next with error',
    body: { name: 42 },
    validator: create({ name: isString }),
    error: true
  },
  {
    it: 'pass validation',
    body: { name: 'name' },
    validator: create({ name: isString }),
    error: false
  },
  {
    it: 'pass validation with wrapper',
    body: { name: 'name' },
    validator: create({
      name: wrap(isString, { minLength: 2 })
    }),
    error: false
  },
  {
    it: 'fail validation with wrapper',
    body: { name: 'name' },
    validator: create({
      name: wrap(isString, { minLength: 5 })
    }),
    error: true
  },
  {
    it: 'pass due to optional constraint',
    body: {},
    validator: create({
      name: wrap(isString, { optional: true })
    })
  },
  {
    it: 'fail due to non-optional constraint',
    body: {},
    validator: create({
      name: wrap(isString, { optional: false })
    }),
    error: true
  },
  {
    it: 'pass when all props are optional on nested prop',
    body: {},
    validator: create({
      sub: {
        foo: wrap(isString, { optional: true }),
        bar: wrap(isString, { optional: true })
      }
    })
  },
  {
    it: 'fail when a prop is required on a nested prop with optionals',
    body: { foo: 'prop' },
    validator: create({
      foo: isString,
      sub: {
        foo: wrap(isString, { optional: true }),
        bar: wrap(isString, { optional: true }),
        baz: wrap(isString, { optional: false })
      }
    }),
    error: true
  },
  {
    it: 'pass when a prop is required on a nested prop with optionals',
    body: { foo: 'prop', sub: { baz: 'qux' } },
    validator: create({
      foo: isString,
      sub: {
        foo: wrap(isString, { optional: true }),
        bar: wrap(isString, { optional: true }),
        baz: wrap(isString, { optional: false })
      }
    }),
    error: false
  },
  {
    it: 'pass extra properties when not strict',
    body: { extra: 'extra prop' },
    validator: create({}),
    isExpected: body => body.extra === 'extra prop',
    error: false
  },
  {
    it: 'remove extra properties when strict',
    body: { extra: 'extra prop' },
    validator: create({}, { strict: true }),
    isExpected: body => body.extra === undefined,
    error: false
  },
  {
    it: 'will pass extra props when not strict on nested objects',
    body: { foo: { baz: 'baz', extra: 'extra prop' }, bar: 'bar' },
    validator: create(
      {
        bar: isString,
        foo: {
          baz: isString
        }
      },
      { strict: false }
    ),
    isExpected: body =>
      body.foo.extra === 'extra prop' && body.foo.baz === 'baz' && body.bar === 'bar'
  },
  {
    it: 'will remove extra props when strict on nested objects',
    body: { foo: { baz: 'baz', extra: 'extra prop' }, bar: 'bar' },
    validator: create(
      {
        bar: isString,
        foo: {
          baz: isString
        }
      },
      { strict: true }
    ),
    isExpected: body => body.foo.extra === undefined && body.foo.baz === 'baz' && body.bar === 'bar'
  },
  {
    it: 'will validate an array with primitives',
    body: { foo: [42, 84] },
    validator: create({ foo: wrap(isArray, { validator: isNumber }) }),
    isExpected: body => body.foo.every((val: any) => val > 0)
  },
  {
    it: 'will allow primitive reqest body',
    body: 42,
    validator: create(isNumber),
    isExpected: body => body === 42
  },
  {
    it: 'will allow array as reqest body',
    body: [42, 84],
    validator: create(wrap(isArray, { validator: isNumber })),
    isExpected: body => body[0] === 42 && body[1] === 84
  },
  {
    it: 'will disallow invalid array as reqest body',
    body: [42, 'foo'],
    validator: create(wrap(isArray, { validator: isNumber })),
    error: true
  }
]

describe('create()', () => {
  for (const test of tests) {
    const [result, req, res, next] = mock(test.body)
    it(`will ${test.it}`, done => {
      test.validator(req as any, res as any, next as any)

      if (test.isExpected) {
        const actual = test.isExpected(req.body)
        expect(actual, 'body is as expected').to.equal(true)
      }

      const promise = result as Promise<any>
      promise
        .then(() => {
          const actual = true
          const expected = test.error !== true
          expect(actual, 'will not raise error').to.equal(expected)
        })
        .catch(err => {
          // We will only have an error object if the expectation failed in the fulfill handler
          if (err) throw err

          const actual = true
          const expected = test.error === true
          expect(actual, 'will raise error').to.equal(expected)
        })
        .then(done)
        .catch(done)
    })
  }
})

function mock(body: any): [Promise<any>, Request, Response, NextFunction] {
  let resolver: Function
  let rejecter: Function
  const promise = new Promise((resolve, reject) => {
    resolver = resolve
    rejecter = reject
  })
  return [
    promise,
    { body } as any,
    {} as any,
    (_err: any) => {
      if (_err) {
        return rejecter()
      }
      resolver()
    }
  ]
}
