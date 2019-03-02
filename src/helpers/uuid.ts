import { OPTIONAL } from './util'

export interface UuidOptions {
  optional?: boolean
}

/** Valid uuid regex required by `isUuid()`. */
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * Validates a uuid as per RFC4122 using this code stolen from Stack Overflow:
 *
 * https://stackoverflow.com/a/13653180/246901
 */
export function isUuid(value: any, opts: UuidOptions = {}) {
  if (value === undefined) {
    return opts.optional ? OPTIONAL : undefined
  }

  if (typeof value !== 'string') {
    return
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  return uuidRegex.test(trimmed) ? trimmed : undefined
}
