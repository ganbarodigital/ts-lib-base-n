// tslint:disable: no-bitwise
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
import { BaseNFlags } from "./flags";

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
): string {
    // we can use the Buffer to do the heavy lifting
    const b64 = input.toString("base64");

    // we need to translate a couple of the characters
    //
    // according to our testing, this is the fastest way to do so
    if (flags & BaseNFlags.addPadding) {
        return b64.replace(/[\+\/]/g, (match) => {
            if (match === "+") {
                return "-";
            }

            return "_";
        });
    }

    return b64.replace(/[\+\/=]/g, (match) => {
        switch (match) {
            case "+":
                return "-";
            case "/":
                return "_";
            default:
                return "";
        }
    });
}

const bitGroup1 = 63 << 18;
const bitGroup2 = 63 << 12;
const bitGroup3 = 63 << 6;

const TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

/**
 * converts the given input into RFC-4648 base64 URL-safe encoding
 * (aka base64url), with padding characters removed (you can add them
 * back with a flag, if you really need them)
 *
 * this function exists mostly for completeness. We haven't documented it,
 * and you shouldn't use it.
 *
 * @param flags
 *        any combination of the BaseNFlags
 */
export function base64UrlEncodeFromString(
    input: string,
    flags: number = BaseNFlags.default,
): string {
    let inputOffset = 0;
    let retval = "";
    let bitGroupCount = 0;
    let quantum = 0;
    let bitGroups: number[];

    const maxBitGroups = Math.ceil(input.length * 8 / 6);

    const readByte = (i: number): number => {
        if (i < input.length) {
            return input.charCodeAt(i);
        }

        return 0;
    };

    const readQuantum = (): void => {
        quantum = (readByte(inputOffset) << 16)
        + (readByte(inputOffset + 1) << 8)
        + readByte(inputOffset + 2);

        inputOffset = inputOffset + 3;
    };

    const extractBitGroups = (): void => {
        bitGroups = [
            (quantum & bitGroup1) >>> 18,
            (quantum & bitGroup2) >>> 12,
            (quantum & bitGroup3) >>> 6,
            quantum & 63,
        ];
    };

    const translateBitGroups = (): void => {
        retval = retval + TABLE[bitGroups[0]] + TABLE[bitGroups[1]] + TABLE[bitGroups[2]] + TABLE[bitGroups[3]];
    };

    const incBitGroupCount = (): void => {
        bitGroupCount += 4;
    };

    for (; bitGroupCount < maxBitGroups;) {
        readQuantum();
        extractBitGroups();
        translateBitGroups();
        incBitGroupCount();
    }

    retval = retval.substr(0, maxBitGroups);

    // do we need to add padding to the end of this string?
    if (flags & BaseNFlags.addPadding) {
        const paddingRequired = (
            4
            - (retval.length % 4)
        ) % 4;

        retval = retval + "=".repeat(paddingRequired);
    }

    // all done
    return retval;
}