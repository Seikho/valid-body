import { Validator } from '../types'
import { OPTIONAL } from './util'
import { validateObject } from '../validate'

export interface ArrayOptions {
  optional?: boolean

  /** Ensure that every element in the array is a specific type */
  validator?: Validator
}

export function isArray(value: any, opts: ArrayOptions = {}) {
  if (value === undefined) {
    return opts.optional ? OPTIONAL : undefined
  }

  if (!Array.isArray(value)) {
    return
  }

  if (opts.validator) {
    const parsed: any[] = []
    for (const entry of value) {
      const { errors, result } = validateObject(opts.validator, entry, {})
      if (errors.length > 0) {
        return undefined
      }
      parsed.push(result)
    }
    return parsed
  }

  return value
}
