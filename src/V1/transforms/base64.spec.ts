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
import { isBase64UrlData } from "../guards";
import { base64UrlEncodeFromBuffer, base64UrlEncodeFromString } from "./base64";
import { BaseNFlags } from "./flags";

describe("base64UrlEncodeFromBuffer()",  () => {
    it("encodes a bytes buffer", () => {
        const inputValue = Buffer.from("0102030405fffefcfbfa", "hex");
        const expectedValue = "AQIDBAX__vz7-g";
        const actualValue = base64UrlEncodeFromBuffer(inputValue);

        expect(actualValue).toEqual(expectedValue);
        expect(actualValue).toEqual(base64UrlEncodeFromString(inputValue.toString("binary")));
    });

    it("doesn't add the padding characters by default", () => {
        const inputValue = Buffer.from("0102030405fffefcfbfa", "hex");
        const expectedValue = "AQIDBAX__vz7-g";
        const actualValue = base64UrlEncodeFromBuffer(inputValue);

        expect(actualValue).toEqual(expectedValue);
        expect(actualValue).toEqual(base64UrlEncodeFromString(inputValue.toString("binary")));
    });

    it("honours the flag to add the padding characters", () => {
        const inputValue = Buffer.from("0102030405fffefcfbfa", "hex");
        const expectedValue = "AQIDBAX__vz7-g==";
        const actualValue = base64UrlEncodeFromBuffer(inputValue, BaseNFlags.addPadding);

        expect(actualValue).toEqual(expectedValue);
        expect(actualValue).toEqual(base64UrlEncodeFromString(inputValue.toString("binary"), BaseNFlags.addPadding));
    });
});

describe("base64UrlEncodeFromString()",  () => {
    it("encodes a string", () => {
        const inputValue = "0102030405fffefcfbfa";
        const expectedValue = "MDEwMjAzMDQwNWZmZmVmY2ZiZmE";
        const actualValue = base64UrlEncodeFromString(inputValue);

        expect(actualValue).toEqual(expectedValue);
        expect(actualValue).toEqual(base64UrlEncodeFromBuffer(Buffer.from(inputValue)));
        expect(isBase64UrlData(actualValue)).toBeTrue();
    });

    it("doesn't add the padding characters by default", () => {
        const inputValue = "0102030405fffefcf";
        const expectedValue = "MDEwMjAzMDQwNWZmZmVmY2Y";
        const actualValue = base64UrlEncodeFromString(inputValue);

        expect(actualValue).toEqual(expectedValue);
        expect(actualValue).toEqual(base64UrlEncodeFromBuffer(Buffer.from(inputValue)));
        expect(isBase64UrlData(actualValue)).toBeTrue();
    });

    it("honours the flag to add the padding characters", () => {
        const inputValue = "0102030405fffefcf";
        const expectedValue = "MDEwMjAzMDQwNWZmZmVmY2Y=";
        const actualValue = base64UrlEncodeFromString(inputValue, BaseNFlags.addPadding);

        expect(actualValue).toEqual(expectedValue);
        expect(actualValue).toEqual(base64UrlEncodeFromBuffer(Buffer.from(inputValue), BaseNFlags.addPadding));
    });
});
