import { OPTIONAL } from './util'

export interface StringOptions {
  allowed?: string[]
  minLength?: number
  maxLength?: number
  trim?: boolean
  optional?: boolean
}

export function isString(value: any, opts: StringOptions = {}) {
  if (value === undefined) {
    return opts.optional ? OPTIONAL : undefined
  }

  if (typeof value !== 'string') {
    return
  }

  const parsed = opts.trim ? value.trim() : value

  if (opts.allowed) {
    const isAllowed = opts.allowed.some(allowed => allowed === parsed)
    if (!isAllowed) {
      return
    }
  }

  if (opts.minLength !== undefined && parsed.length < opts.minLength) {
    return
  }

  if (opts.maxLength !== undefined && parsed.length > opts.maxLength) {
    return
  }

  return parsed
}
