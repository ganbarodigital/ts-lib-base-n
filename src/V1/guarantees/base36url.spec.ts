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
import { OnError } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";

import { mustBeBase36UrlData } from "./base36url";

describe("mustBeBase36UrlData()",  () => {
    it("accepts a valid base36url string", () => {
        const inputValue = "csob4hq5gmgnycenf7ezy";
        mustBeBase36UrlData(inputValue);
    });

    it("accepts a user-defined error handler", () => {
        const onError: OnError = (e) => {
            throw new Error("our test passed");
        };

        const inputValue = "csob4hq5gmgnycenf7ezyZ";
        expect(() => {mustBeBase36UrlData(inputValue, onError); }).toThrowError("our test passed");
    });

    const invalidStrings = [
        "-csob4hq5gmgnycenf7ezy",
        "csob4hq5-gmgnycenf7ezy",
        "csob4hq5gmgnycenf7ezy-",
    ];

    for (const invalidString of invalidStrings) {
        it("rejects an invalid base36url string: " + invalidString, () => {
            const inputValue = invalidString;

            expect(() => {mustBeBase36UrlData(inputValue); }).toThrowError();
        });
    }
});
