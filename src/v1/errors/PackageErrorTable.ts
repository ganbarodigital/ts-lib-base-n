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
import {
    ErrorTable,
    ErrorTableTemplateWithNoExtraData,
    ExtraDataTemplate,
    NoExtraDataTemplate,
} from "@ganbarodigital/ts-lib-error-reporting/lib/v1";
import { httpStatusCodeFrom } from "@ganbarodigital/ts-lib-http-types/lib/v1";
import { packageNameFrom } from "@ganbarodigital/ts-lib-packagename/lib/v1";

import { InvalidBase32UrlTemplate } from "./InvalidBase32Url";
import { InvalidBase36UrlTemplate } from "./InvalidBase36Url";
import { InvalidBase64UrlTemplate } from "./InvalidBase64Url";

const PACKAGE_NAME = packageNameFrom("@ganbarodigital/ts-lib-base-n/lib/v1");

export class PackageErrorTable implements ErrorTable {
    [key: string]: ErrorTableTemplateWithNoExtraData<ErrorTable, string, ExtraDataTemplate | NoExtraDataTemplate>;

    public "invalid-base32url": InvalidBase32UrlTemplate = {
        packageName: PACKAGE_NAME,
        errorName: "invalid-base32url",
        detail: "input is not in base32url format",
        status: httpStatusCodeFrom(422),
        extra: {
            public: {
                input: "",
            },
        },
    };

    public "invalid-base36url": InvalidBase36UrlTemplate = {
        packageName: PACKAGE_NAME,
        errorName: "invalid-base36url",
        detail: "input is not in base36url format",
        status: httpStatusCodeFrom(422),
        extra: {
            public: {
                input: "",
            },
        },
    };

    public "invalid-base64url": InvalidBase64UrlTemplate = {
        packageName: PACKAGE_NAME,
        errorName: "invalid-base64url",
        detail: "input is not in base64url format",
        status: httpStatusCodeFrom(422),
        extra: {
            public: {
                input: "",
            },
        },
    };
}

export const ERROR_TABLE = new PackageErrorTable();