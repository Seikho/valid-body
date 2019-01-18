import { OPTIONAL } from './util'

export interface EmailOptions {
  optional?: boolean
}

export function isEmail(value: any, opts: EmailOptions = {}) {
  if (value === undefined) {
    return opts.optional ? OPTIONAL : undefined
  }

  if (typeof value !== 'string') {
    return
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const isEmail = value.match(emailRegex) !== null
  return isEmail ? value : undefined
}
