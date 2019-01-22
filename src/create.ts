import { Validator, CreateOptions, ValidatorMiddleware } from './types'
import { getRequestProp, StatusError } from './util'
import { validateObject } from './validate'

export function create(
  validator: Validator,
  opts: CreateOptions = {}
): ValidatorMiddleware {
  const mw: ValidatorMiddleware = (req, _res, next) => {
    const prop = getRequestProp(opts)
    const body = req[prop]
    if (!body) {
      return next(new StatusError('No body received', 400))
    }

    const { errors, result } = validateObject(validator, body, opts)
    if (errors.length) {
      const message = errors.join('\n')
      return next(
        new StatusError(`Bad request: Invalid request ${prop}\n${message}`, 400)
      )
    }

    req[prop] = result
    next()
  }

  return mw
}
