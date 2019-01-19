import { Request, Response, NextFunction } from 'express'
import { Validator } from './types'
import { validateObject } from './validate'

export * from './types'
export * from './helpers'

export class StatusError extends Error {
  constructor(public message: string, public status: number) {
    super()
  }
}

export type ValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void

export interface CreateOptions {
  query?: boolean
}

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

    const { errors, result } = validateObject(validator, body)
    if (errors.length) {
      const message = errors.join('\n')
      return next(
        new StatusError(`Bad request: Invalid request body\n${message}`, 400)
      )
    }

    req[prop] = result
    next()
  }

  return mw
}

function getRequestProp(opts: CreateOptions): 'body' | 'query' {
  const useQuery = opts.query
  if (useQuery) {
    return 'query'
  }

  return 'body'
}
