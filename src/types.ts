import * as h from './helpers'
import { Request, Response, NextFunction } from 'express'

export type ValueValidator<TValue = unknown> = (
  value: TValue,
  opts?: {}
) => TValue | Symbol | undefined

export type ValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void

export type Validator = { [key: string]: ValueValidator | Validator }

export type TypeValidator =
  | typeof h.isString
  | typeof h.isNumber
  | typeof h.isBoolean
  | typeof h.isArray
  | typeof h.isEmail
  | typeof h.isTimestamp

export type ValidatorOption<
  T extends TypeValidator
> = T extends typeof h.isString
  ? h.StringOptions
  : T extends typeof h.isNumber
  ? h.NumberOptions
  : T extends typeof h.isBoolean
  ? h.BooleanOptions
  : T extends typeof h.isArray
  ? h.ArrayOptions
  : T extends typeof h.isEmail
  ? h.EmailOptions
  : h.TimestampOptions

export interface CreateOptions {
  strict?: boolean
  query?: boolean
}
