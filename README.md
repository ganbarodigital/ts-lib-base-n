# BaseN Library for Typescript

## Introduction

This TypeScript library will convert to/from various baseN encodings.

We've built this to use in shortening UUIDs in a URL-friendly way. There's nothing stopping you from using it to encode anything you want.

## Quick Start

```
# run this from your Terminal
npm install @ganbarodigital/ts-lib-baseN
```

```typescript
// add this import to your Typescript code
import { base64UrlEncode } from "@ganbarodigital/ts-lib-baseN/V1"
```

__VS Code users:__ once you've added a single import anywhere in your project, you'll then be able to auto-import anything else that this library exports.

- [Introduction](#introduction)
- [Quick Start](#quick-start)
- [V1 API](#v1-api)
  - [base62FromBytes()](#base62frombytes)
  - [base62ToBytes()](#base62tobytes)
  - [base62FromString()](#base62fromstring)
  - [base62ToString()](#base62tostring)
  - [isBase62String()](#isbase62string)
  - [mustBeBase62String()](#mustbebase62string)
- [V1 Error API](#v1-error-api)
  - [invalidBase62String](#invalidbase62string)
  - [InvalidBase62StringError](#invalidbase62stringerror)
  - [isInvalidBase62StringError()](#isinvalidbase62stringerror)
  - [throwInvalidBase62StringError()](#throwinvalidbase62stringerror)
- [NPM Scripts](#npm-scripts)
  - [npm run clean](#npm-run-clean)
  - [npm run build](#npm-run-build)
  - [npm run test](#npm-run-test)
  - [npm run cover](#npm-run-cover)

## V1 API

### base62FromBytes()

TBD.

### base62ToBytes()

TBD.

### base62FromString()

TBD.

### base62ToString()

TBD.

### isBase62String()

```typescript
function isBase62String(input: string): boolean
```

`isBase62String()` is a _data guard_.

* Returns `true` if the `input` only contains valid base62 characters.
* Returns `false` otherwise.

### mustBeBase62String()

```typescript
import { OnError } from "@ganbarodigital/ts-on-error/V1";

function mustBeBase62String(input: string, onError?: OnError<string|any>): void
```

`mustBeBase62String()` is a _data guarantee_.

* If the `input` string is valid base62-encoded data, it will return.
* Otherwise, it will call the supplied `onError` error callback.

Other notes:

* `onError` is optional. It uses `throwInvalidBase62StringError()` if you do not provide one.

## V1 Error API

### invalidBase62String

```typescript
const invalidBase62String = Symbol("Invalid Base62 String");
```

Unique ID for the family of errors around strings that do not contain valid base62 data.

### InvalidBase62StringError

```typescript
class InvalidBase62StringError extends Error {
    // holds the string that didn't contain base62-encoded data
    public readonly invalidString: string;

    /**
     * constructor
     *
     * @param input
     *        the string that didn't contain base62-encoded data
     */
    constructor(input: string) {
        super();
        this.invalidString = input;
    }
}
```

JavaScript Error. Thrown when we encounter a string that does not contain valid base62 data.

### isInvalidBase62StringError()

```typescript
function isInvalidBase62StringError(input: any): input is InvalidBase62StringError
```

`isInvalidBase62StringError()` is a _type guard_. Use it to prove to the TypeScript compiler that you are dealing with an `InvalidBase62StringError` type.

### throwInvalidBase62StringError()

```typescript
import { OnError } from "@ganbarodigital/ts-on-error/V1";

const throwInvalidBase62StringError: OnError<string> = (reason, description, extra)
```

`throwInvalidBase62StringError()` is an error handler. When called, it throws a new `InvalidBase62StringError` object.

## NPM Scripts

### npm run clean

Use `npm run clean` to delete all of the compiled code.

### npm run build

Use `npm run build` to compile the Typescript into plain Javascript. The compiled code is placed into the `lib/` folder.

`npm run build` does not compile the unit test code.

### npm run test

Use `npm run test` to compile and run the unit tests. The compiled code is placed into the `lib/` folder.

### npm run cover

Use `npm run cover` to compile the unit tests, run them, and see code coverage metrics.

Metrics are written to the terminal, and are also published as HTML into the `coverage/` folder.