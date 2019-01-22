import { CreateOptions } from './types'

export class StatusError extends Error {
  constructor(public message: string, public status: number) {
    super()
  }
}

export function getRequestProp(opts: CreateOptions): 'body' | 'query' {
  const useQuery = opts.query
  if (useQuery) {
    return 'query'
  }

  return 'body'
}
