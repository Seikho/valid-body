import { Validator, ValueValidator } from './types'
import { OPTIONAL } from './helpers'

export function validateObject<TBody extends {}>(
  validator: Validator,
  input: TBody,
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
    if (!validFn) {
      errors.push(`Unexpected property: ${pre}${key}`)
      continue
    }

    const isValidatorNested = Object.keys(validFn as any).length > 0
    const isValueNested =
      value === undefined ? false : Object.keys(value).length > 0
    if (isValidatorNested && isValueNested) {
      const inPre = pre ? `${key}.${pre}` : `${key}.`
      const { errors: subErrors, result: subResult } = validateObject(
        validFn as Validator,
        value,
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

  return { errors, result }
}

function isValidatorFunc<T>(func: any): func is ValueValidator<T> {
  return typeof func === 'function'
}
