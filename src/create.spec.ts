import { expect } from 'chai'
import { create, ValidatorMiddleware, wrap } from '.'
import { isString } from './helpers'
import { Request, Response, NextFunction } from 'express'

interface Test {
  it: string
  body: any
  validator: ValidatorMiddleware
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
    it: 'fail due to optional constraint',
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
  }
]

describe('middleware tests', () => {
  for (const test of tests) {
    const [result, req, res, next] = mock(test.body)
    it(`will ${test.it}`, done => {
      test.validator(req as any, res as any, next as any)

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