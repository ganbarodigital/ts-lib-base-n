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
import { base36UrlEncodeFromBuffer, base36UrlEncodeFromString } from "./base36";

describe("base36UrlEncodeFromBuffer()",  () => {
    it("encodes a bytes buffer", () => {
        const inputValue = Buffer.from("306af19c41a44b21857232308e6c03ea", "hex");
        const expectedValue = "2v6wzt8h82b4efcjdelmiaxuy";
        const actualValue = base36UrlEncodeFromBuffer(inputValue);

        expect(actualValue).toEqual(expectedValue);
    });
});

describe("base36UrlEncodeFromString()",  () => {
    it("encodes a string", () => {
        const inputValue = "306af19c-41a4-4b21-8572-32308e6c03ea";
        const expectedValue = "2imeed0dqv5jzu32jekcovxobofe73qakmmreyq6io224p4qegysdco1";
        const actualValue = base36UrlEncodeFromString(inputValue);

        expect(actualValue).toEqual(expectedValue);
    });
});
