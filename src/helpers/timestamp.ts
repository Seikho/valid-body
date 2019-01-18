import { OPTIONAL } from './util'

export interface TimestampOptions {
  optional?: boolean
}

export function isTimestamp(value: any, opts: TimestampOptions = {}) {
  if (value === undefined) {
    return opts.optional ? OPTIONAL : undefined
  }

  const date = new Date(value)
  return date.getTime() >= 0 ? value : undefined
}
