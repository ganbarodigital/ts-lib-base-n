# BaseN Library for Typescript

## Introduction

This TypeScript library will convert to/from various base-N encodings.

We've built this to use in shortening UUIDs in a URL-friendly way. There's nothing stopping you from using it to encode anything you want.

- [Introduction](#introduction)
- [Quick Start](#quick-start)
- [V1 API](#v1-api)
  - [Comparision Of Transforms](#comparision-of-transforms)
  - [base64UrlEncodeFromBuffer()](#base64urlencodefrombuffer)
  - [base36UrlEncodeFromBuffer()](#base36urlencodefrombuffer)
  - [base32UrlEncodeFromBuffer()](#base32urlencodefrombuffer)
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
  - [npm run benchmark](#npm-run-benchmark)

## Quick Start

```
# run this from your Terminal
npm install @ganbarodigital/ts-lib-base-n
```

```typescript
// add this import to your Typescript code
import { base64UrlEncode } from "@ganbarodigital/ts-lib-base-n/V1"
```

__VS Code users:__ once you've added a single import anywhere in your project, you'll then be able to auto-import anything else that this library exports.

## V1 API

### Comparision Of Transforms

This library's original use-case is to help with encoding a UUID into something smaller. A UUID is 16 bytes (in binary form), and 36 bytes (as a well-formatted string with the '-' characters).

Working with binary fields in a database isn't fun, especially if they're primary keys or foreign keys. But how small can we make these UUIDs, and still store them as a string?

```typescript
import {
    base64UrlEncodeFromBuffer,
    base36UrlEncodeFromBuffer,
    base32UrlEncodeFromBuffer,
} from "@ganbarodigital/ts-lib-base-n/V1";

// get rid of the hyphens from the UUID
//
// this gets us from 36 bytes to 32 bytes
const uuid = "306af19c-41a4-4b21-8572-32308e6c03ea".split("-").join();

// store the UUID as binary data in a Buffer
//
// this gets us from 32 bytes to 16 bytes
const buf = Buffer.from(uuid, "hex");

// let's see how small we can go
console.log(base64UrlEncodeFromBuffer(buf).length);
console.log(base36UrlEncodeFromBuffer(buf).length);
console.log(base32UrlEncodeFromBuffer(buf).length);
```

Here's a table showing the output sizes each function achieves, along with the rough performance difference between each algorithm (based on our benchmark script).

function                                                  | output size | reduction | performance
----------------------------------------------------------|-------------|---------- | ------------
[base64UrlEncodeFromBuffer()](#base64urlencodefrombuffer) | 22          | 31%       | *4
[base36UrlEncodeFromBuffer()](#base36urlencodefrombuffer) | 25          | 22%       | *1
[base32UrlEncodeFromBuffer()](#base32urlencodefrombuffer) | 26          | 19%       | *2

`base64UrlEncodeFromBuffer()` is both the fastest, and it produces the smallest result. The result is case-sensitive though, and that doesn't suit everyone's needs.

`base32UrlEncodeFromBuffer()` is the next fastest (about twice as slow as `base64UrlEncodeFromBuffer()`). It produces the largest result - 4 characters more than `base64UrlEncodeFromBuffer()`. The result is case-insensitive, and therefore safe to use just about anywhere.

In the middle, we have `base36UrlEncodeFromBuffer()`. It's the slowest algorithm (about four times slower than `base64UrlEncodeFromBuffer()`), and the result is only one character shorter than what `base32UrlEncodeFromBuffer()` produces. The result is also case-insensitive.

Which one is right for you?

* Use `base64UrlEncodeFromBuffer()` when:
  - you need both max performance and minimum storage, and
  - when the result does NOT need to be case-insensitive
* Use `base36UrlEncodeFromBuffer()` when:
  - you need minimum storage, and
  - when the result DOES need to be case-insensitive
* Use `base32UrlEncodeFromBuffer()` when:
  - `base36UrlEncodeFromBuffer()` is too slow for your needs, and
  - when the result DOES need to be case-insensitive

### base64UrlEncodeFromBuffer()

```typescript
/**
 * converts the given input into RFC-4648 base64 URL-safe encoding
 * (aka base64url), with padding characters removed (you can add them
 * back with a flag, if you really need them)
 *
 * optimised for both small (eg UUID) and large (embedded images) input
 *
 * @param flags
 *        any combination of the BaseNFlags
 */
export function base64UrlEncodeFromBuffer(
    input: Buffer,
    flags: number = BaseNFlags.default,
): string;
```

`base64UrlEncodeFromBuffer()` is a _data transform_. It will take the *binary data* in the `input` buffer, and encode it using the _base64url_ alphabet from [RFC 4648][RFC 4648].

### base36UrlEncodeFromBuffer()

```typescript
/**
 * converts the given input into a base36 encoding, suitable for use
 * in URLs and on case-insensitive filesystems
 *
 * `base32UrlEncodeFromBuffer()` will perform about twice as fast,
 * if performance is more important than reducing storage
 */
export function base36UrlEncodeFromBuffer(input: Buffer): string;
```

`base36UrlEncodeFromBuffer()` is a _data transform_. It will take the *binary data* in the `input` buffer, and encode it using a 36-character alphabet (0-9, a-z).

This function uses JavaScript's `BigInt` type to do the heavy lifting. Different implementations of `BigInt` _may_ produce different results for the exact same `input` buffer.

### base32UrlEncodeFromBuffer()

```typescript
/**
 * converts the given input into a base32 encoding, suitable for use
 * in URLs and on case-insensitive filesystems
 *
 * this function does NOT use the RFC-4648 algorithm
 *
 * `base64UrlEncodeFromBuffer()` will perform about twice as fast,
 * and give you a smaller result (but the result is NOT case-insensitive)
 */
export function base32UrlEncodeFromBuffer(input: Buffer): string;
```

`base32UrlEncodeFromBuffer()` is a _data transform_. It will take the *binary data* in the `input` buffer, and encode it using a 32-character alphabet (0-9, a-v);

This function uses JavaScript's `BigInt` type to do the heavy lifting. Different implementations of `BigInt` _may_ produce different results for the exact same `input` buffer.

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

### npm run benchmark

Use `npm run benchmark` to see how well our functions perform against other options.

[RFC 4648]: https://tools.ietf.org/html/rfc4648