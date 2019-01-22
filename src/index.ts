import { TypeValidator, ValidatorOption, ValueValidator } from './types'

export * from './types'
export * from './helpers'
export * from './create'
export * from './first'
export { StatusError } from './util'

export function wrap<TValidator extends TypeValidator>(
  valid: TValidator,
  opts: ValidatorOption<TValidator>
): ValueValidator {
  // TODO: Why isn't 'valid' inferred as a function?
  return (value: any) => {
    return (valid as any)(value, opts)
  }
}
