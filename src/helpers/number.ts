import { OPTIONAL } from './util'

export interface NumberOptions {
  optional?: boolean
  min?: number
  max?: number
}

export function isNumber(value: any, opts: NumberOptions = {}) {
  if (typeof value !== 'string') {
    return opts.optional ? OPTIONAL : undefined
  }

  const num = Number(value)
  if (typeof num !== 'number') {
    return
  }

  if (isNaN(num)) {
    return
  }

  if (opts.min !== undefined && num < opts.min) {
    return
  }

  if (opts.max !== undefined && num > opts.max) {
    return
  }

  return num
}
