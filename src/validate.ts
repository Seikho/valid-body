import { Validator, ValueValidator, CreateOptions } from './types'
import { OPTIONAL } from './helpers'

export function validateObject<TBody extends {}>(
  validator: Validator,
  input: TBody,
  opts: CreateOptions,
  pre = ''
): { errors: string[]; result: unknown } {
  const keys = Object.keys(validator) as Array<keyof typeof input>
  const errors: string[] = []
  const result: any = {}
  const body = (input || {}) as TBody

  for (const key of keys) {
    const value = body[key]

    // TODO: Make this optional via create() options
    const validFn = validator[key as string]

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
