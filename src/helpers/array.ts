import { ValueValidator } from '../types'
import { OPTIONAL } from './util'

export interface ArrayOptions<T = any> {
  optional?: boolean

  /** Ensure that every element in the array is a specific type */
  validator?: ValueValidator<T>
}

export function isArray(value: any, opts: ArrayOptions = {}) {
  if (value === undefined) {
    return opts.optional ? OPTIONAL : undefined
  }

  if (!Array.isArray(value)) {
    return
  }

  if (opts.validator) {
    const isAllValid = value.map(opts.validator).every(entryExists)
    return isAllValid ? value : undefined
  }

  return value
}

function entryExists(value: any) {
  return value !== undefined
}
