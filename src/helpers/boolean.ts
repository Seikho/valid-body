import { OPTIONAL } from './util'
import { isString } from './string'

export interface BooleanOptions {
  optional?: boolean

  /** If the value is a string of 'true' or 'false', cast it to a boolean */
  parse?: boolean
}

const allowed = ['true', 'false']
export function isBoolean(value: any, opts: BooleanOptions = {}) {
  if (value === undefined) {
    return opts.optional ? OPTIONAL : undefined
  }

  if (typeof value === 'string' && isString(value, { allowed })) {
    return value === 'true'
  }

  return typeof value === 'boolean' ? value : undefined
}
