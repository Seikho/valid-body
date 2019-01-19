import { ValidatorMiddleware } from '../types'

export type TypeValidator<TOpts> = (
  value: any,
  opts?: TOpts
) => ValidatorMiddleware
