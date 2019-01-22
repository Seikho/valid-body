import { Validator, CreateOptions, ValidatorMiddleware } from './types'
import { getRequestProp, StatusError } from './util'
import { validateObject } from './validate'

export function first(opts: CreateOptions, ...validators: Validator[]) {
  const mw: ValidatorMiddleware = (req, _res, next) => {
    const prop = getRequestProp(opts)
    const body = req[prop]
    if (!body) {
      return next(new StatusError('No body received', 400))
    }

    for (const validator of validators) {
      const { errors, result } = validateObject(validator, body, opts)
      if (errors.length > 0) {
        continue
      }

      req[prop] = result
      next()
      return
    }

    return next(
      new StatusError(
        `Bad request: Invalid request body. Failed to validate`,
        400
      )
    )
  }

  return mw
}
