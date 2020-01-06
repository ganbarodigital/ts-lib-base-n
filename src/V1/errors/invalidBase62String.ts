//
// Copyright (c) 2020-present Ganbaro Digital Ltd
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//
//   * Re-distributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//
//   * Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in
//     the documentation and/or other materials provided with the
//     distribution.
//
//   * Neither the names of the copyright holders nor the names of his
//     contributors may be used to endorse or promote products derived
//     from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
// FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
// COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
// LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
// ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
//
import { OnError } from "@ganbarodigital/ts-on-error/V1";

/**
 * represents the error 'invalidBase62String'
 */
export const invalidBase62String = Symbol("Invalid Base62 String");

/**
 * Javascript error thrown when a string is not valid base62
 */
export class InvalidBase62StringError extends Error {
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

/**
 * type-guard; proves that input is an InvalidBase62StringError to the
 * TypeScript compiler
 *
 * @param input
 */
export function isInvalidBase62StringError(input: any): input is InvalidBase62StringError {
    if (typeof(input) !== "object") {
        return false;
    }

    if (input.invalidString === undefined) {
        return false;
    }

    return true;
}

/**
 * error callback; throws an InvalidBase62StringError
 *
 * @param reason
 * @param description
 * @param extra
 */
export const throwInvalidBase62StringError: OnError<string> = (reason, description, extra) => {
    throw new InvalidBase62StringError(extra);
};