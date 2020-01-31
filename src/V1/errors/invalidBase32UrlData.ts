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
 * unique ID, used to tell different errors apart
 */
export const invalidBase32UrlData = Symbol("Error: Invalid base32url Data");

/**
 * Javascript error thrown when a string contains something that
 * is not valid base32url
 */
export class InvalidBase32UrlData extends Error {
    // holds the string that didn't contain base32url-encoded data
    public readonly invalidString: string;

    /**
     * constructor
     *
     * @param input
     *        the string that didn't contain base32url-encoded data
     */
    constructor(input: string) {
        super(invalidBase32UrlData.toString());
        this.invalidString = input;
    }
}

/**
 * type-guard; proves that input is an InvalidBase32UrlData to the
 * TypeScript compiler
 *
 * @param input
 */
export function isInvalidBase32UrlData(input: unknown): input is InvalidBase32UrlData {
    if (typeof(input) !== "object") {
        return false;
    }

    if ((input as InvalidBase32UrlData).invalidString === undefined) {
        return false;
    }

    return true;
}

/**
 * error callback; throws an InvalidBase32UrlData
 *
 * @param reason
 * @param description
 * @param extra
 */
export const throwInvalidBase32UrlData: OnError<string> = (reason, description, extra) => {
    throw new InvalidBase32UrlData(extra);
};