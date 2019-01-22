import { expect } from 'chai'
import { ValidatorMiddleware, first } from '.'
import { isString, isNumber } from './helpers'
import { Request, Response, NextFunction } from 'express'

interface Test {
  it: string
  body: any
  validator: ValidatorMiddleware
  isExpected?: (body: any) => boolean
  error?: boolean
}

const nameMw = { name: isString }
const ageMw = { age: isNumber }

const tests: Test[] = [
  {
    it: 'match the first validator',
    body: { name: 'name' },
    validator: first([nameMw, ageMw]),
    isExpected: body => body.name === 'name',
    error: false
  },
  {
    it: 'match the second validator',
    body: { name: 'name' },
    validator: first([ageMw, nameMw]),
    isExpected: body => body.name === 'name',
    error: false
  },
  {
    it: 'match the no validator',
    body: { extra: 42 },
    validator: first([ageMw, nameMw]),
    error: true
  }
]

describe('first()', () => {
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
