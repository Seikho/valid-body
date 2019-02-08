import { Validator, ValueValidator, CreateOptions, ValidatorMap } from './types'
import { OPTIONAL } from './helpers'

export function validateObject<TBody extends {}>(
  validator: Validator,
  input: TBody,
  opts: CreateOptions,
  pre = ''
): { errors: string[]; result: unknown } {
  const errors: string[] = []
  const body = (input || {}) as TBody

  if (isValidatorFunc(validator)) {
    const result = validator(body)
    console.log('here', result, body, validator.name)
    if (result === undefined) {
      errors.push(`Request body is not valid`)
    }
    return { errors, result }
  }

  const validMap = validator as ValidatorMap
  const keys = Object.keys(validator) as Array<keyof typeof input>
  const result: any = {}
  for (const key of keys) {
    const value = body[key]

    // TODO: Make this optional via create() options
    const validFn = validMap[key as string]

    const isValidatorNested = Object.keys(validFn as any).length > 0
    if (isValidatorNested) {
      const inPre = pre ? `${key}.${pre}` : `${key}.`
      const { errors: subErrors, result: subResult } = validateObject(
        validFn as Validator,
        value,
        opts,
        inPre
      )
      errors.push(...subErrors)
      result[key] = subResult
      continue
    }

    if (isValidatorFunc(validFn)) {
      const validResult = validFn(value)
      result[key] = validResult === OPTIONAL ? undefined : validResult
      if (validResult === undefined) {
        errors.push(`'${pre}${key}' is not valid`)
        continue
      }
    }
  }

  if (!opts.strict) {
    const bodyKeys = Object.keys(body)
    for (const key of bodyKeys) {
      if (key in validator) {
        continue
      }

      result[key] = (body as any)[key]
    }
  }

  return { errors, result }
}

function isValidatorFunc<T>(func: any): func is ValueValidator<T> {
  return typeof func === 'function'
}
