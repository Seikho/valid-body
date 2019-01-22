# valid-body

> Express middleware generator for validating requests

Written in TypeScript

## Installation

```sh
> yarn add valid-body
# or:
> npm i valid-body
```

## Usage

Each property

`valid-body` is validate your `request.body` or `request.query` objects.
If they fail validation, they will call `next` with an error so your error middleware can catch it.

```ts
// create-user.ts
import { RequestHandler } from 'express'
import * as valid from 'valid-body'

interface Body {
  name: string
  age: number
  status: 'enabled' | 'disabled'
  description?: string
  meta: {
    favouriteAnimal?: string
  }
}

const validator = valid.create({
  name: valid.isString,
  age: valid.isNumber,
  status: valid.wrap(valid.isString, { allowed: ['enabled', 'disabled'] }),
  description: valid.wrap(valid.isString, { optional: true }),
  meta: {
    favouriteAnimal: valid.wrap(valid.isString, { optional: true })
  }
})

const handler: RequestHandler = async (req, res, next) => {
  const body: Body = req.body
  ...
  res.json('ok!')
}

// user.ts
import { Router } from 'express'
import * as create from './create'

export { router as default }

const router = Router()
router.post('/create', create.validator, create.handler)
```

## API

### create

_CreateOptions_

`query?: boolean` The middleware will use `request.body` by default. Setting `query` to `true` will use `req.query` instead.

`strict?: boolean`: If true, properties not defined in the validator will be removed from the validated object.

```ts
type ValueValidator<TValue = unknown> = (value: TValue) => undefined

type Validator = { [key: string]: ValueValidator | Validator }

interface CreateOptions {
  query?: boolean
  strict?: boolean
}

function create(validator: Validator, opts?: CreateOptions): RequestHandler
```

### isString

```ts
interface StringOptions {
  minLength?: number
  maxLength?: number
  optional?: boolean

  // Evaluates the validations against the .trim()-ed string
  trim?: boolean

  // Whitelist of allowed values
  allowed?: string[]
}

function(value: any, options?: StringOptions): string | undefined
```

### isNumber

```ts
interface NumberOptions {
  min?: number
  max?: number
  optional?: boolean
}

function(value: any, options?: NumberOptions): number | undefined
```

### isBoolean

```ts
interface BooleanOptions {
  optional?: boolean

  /** If the value is a string of 'true' or 'false', cast it to a boolean */
  parse?: boolean
}

function(value: any, options?: BooleanOptions): boolean | undefined
```

### isTimestamp

```ts
interface TimestampOptions {
  optional?: boolean
}

function(value: any, options?: TimestampOptions): number | undefined
```

### isArray

```ts
interface ArrayOptions<T = any> {
  optional?: boolean

  /** Ensure that every element in the array is a specific type */
  validator?: ValueValidator<T>
}

function isArray(value: any, opts: ArrayOptions = {}): Array | undefined
```

### isEmail

```ts
interface EmailOptions {
  optional?: boolean
}

function isEmail(value: any, opts: EmailOptions = {}): string | undefined
```
