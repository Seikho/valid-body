import { Validator, ValueValidator } from '../types'
import { OPTIONAL } from './util'
import { validateObject } from '../validate'

export interface ArrayOptions<T = any> {
  optional?: boolean

  /** Ensure that every element in the array is a specific type */
  validator?: Validator | ValueValidator<T>
}

export function isArray(value: any, opts: ArrayOptions = {}) {
  if (value === undefined) {
    return opts.optional ? OPTIONAL : undefined
  }

  if (!Array.isArray(value)) {
    return
  }

  if (!opts.validator) {
    return value
  }

  if (isValueValidator(opts.validator)) {
    const parsed: any[] = []
    for (const entry of value) {
      const result = opts.validator(entry)
      if (result === undefined) {
        return
      }
      parsed.push(result)
    }
    return parsed
  }

  const parsed: any[] = []
  for (const entry of value) {
    const { errors, result } = validateObject(opts.validator, entry, {})
    if (errors.length > 0) {
      return
    }
    parsed.push(result)
  }

  return parsed
}

function isValueValidator(value: any): value is ValueValidator {
  return typeof value === 'function'
}
