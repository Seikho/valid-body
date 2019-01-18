export type ValueValidator<TValue = unknown> = (
  value: TValue
) => TValue | Symbol | undefined

export type Validator = { [key: string]: ValueValidator | Validator }
