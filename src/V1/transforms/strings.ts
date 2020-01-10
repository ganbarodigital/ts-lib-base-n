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
import base62 = require("./base62");

export function base62StringFromBytes(input: Buffer): string {
    // this is our return value
    let retval = "";

    // base62 does not fit into an exact number of its bits
    // this number holds the overflow that we need to carry
    // into the next translation
    let carry = 0;

    let bitmaskCarry = 0;

    // this keeps track of where we are in our table of
    // pre-calculated bitmasks to apply
    let j = 0;

    // the padding step at the end (see base64 encoding in RFC 4648)
    // is required to ensure that there can only be one valid decoding
    // for any given base64 encoding
    const padLength = input.byteLength % base62.BYTES_REQUIRED;
    // console.log("PAD LENGTH: ", padLength);

    let padInput = 0;
    if (padLength > 0) {
        padInput++;
    }
    const maxI = input.byteLength + padInput;

    // we process the data byte-by-byte
    for (
        let i = 0;
        i < maxI;
        i++
    ) {
        // we only get another byte from the input when `done` is set
        // to true
        let done = false;

        // tslint:disable-next-line: no-console
        // console.log("\n\nNEW BYTE READ");

        // this byte may contain multiple values to translate
        let c = 0;
        if (i < input.byteLength) {
            c = input.readInt8(i);
        }

        // let's process what we have
        while (!done) {
            // tslint:disable-next-line: no-console
            // console.log("  NEW DONE LOOP STARTING");
            const bitmaskSet = base62.BITMASKS[j];

            // tslint:disable-next-line: no-console
            // console.log("    BYTE: ", c.toString(2), "0x" + c.toString(16));

            // tslint:disable-next-line: no-console
            // console.log("    CARRY: ", carry.toString(2), "0x" + carry.toString(16));

            // tslint:disable-next-line: no-console
            // console.log("    BITMASK #", j);
            // tslint:disable-next-line: no-console
            // console.log("    BITMASK: ", bitmaskSet[0].toString(2), bitmaskSet[1]);
            const bitmaskWithCarry = bitmaskSet[0] + bitmaskCarry;
            // console.log("    BITMASK w/ CARRY: ", bitmaskWithCarry.toString(2))

            // do we have enough bits?
            // tslint:disable-next-line: no-bitwise
            const bitmaskValue = bitmaskWithCarry >>> bitmaskSet[1];
            // tslint:disable-next-line: no-console
            // console.log("    BITMASK VALUE: ", bitmaskValue.toString(2), bitmaskValue);
            // tslint:disable-next-line: no-console
            // console.log("    BITMASK_MAX:   ", base62.BITMASK_MAX.toString(2));

            // do we have enough bits left in this byte?
            if (bitmaskValue < base62.BITMASK_SHORT) {
                // tslint:disable-next-line: no-console
                // console.log("    BITMASK BOUNDARY!!!");
                // we cross a byte boundary here
                // tslint:disable-next-line: no-bitwise
                carry = c * 256;
                bitmaskCarry = bitmaskValue * 256;

                // tslint:disable-next-line: no-console
                // console.log("    NEW BITMASK CARRY", bitmaskCarry.toString(2));

                // we need the next byte to examine
                done = true;
            } else {
                // tslint:disable-next-line: no-console
                // console.log("    NOT A BITMASK BOUNDARY");

                // add in the carry FIRST
                let quantum = c + carry;

                // console.log("    V:", v.toString(2), "0x" + v.toString(16));

                // tslint:disable-next-line: no-bitwise
                quantum = (quantum & bitmaskWithCarry) >>> bitmaskSet[1];

                // remove the bits we've just masked off
                // tslint:disable-next-line: no-bitwise
                c = c & (bitmaskSet[0] ^ 255);

                // tslint:disable-next-line: no-console
                // console.log("    quantum:", quantum.toString(2), "0x" + quantum.toString(16));

                // reduce our value, translating as we go
                do {
                    const bQ = quantum % base62.TABLE_LENGTH;
                    // tslint:disable-next-line: no-bitwise
                    quantum = Math.floor(quantum / base62.TABLE_LENGTH);
                    retval = retval + base62.TABLE[bQ];
                } while (quantum > base62.TABLE_LENGTH);

                // whatever is left, is our carry
                // I am sure that this is wrong ATM
                carry = quantum;

                // no bitmask to carry over
                bitmaskCarry = 0;

                // tslint:disable-next-line: no-console
                // console.log("NEW CARRY", carry.toString(2), "0x" + carry.toString(16));
            }

            // move on to the next of our precalculated bitmasks
            j = (j + 1) % base62.BITMASKS.length;

            // do we need a new byte?
            if (j === 0) {
                done = true;
            }

            // have we reached the end of our work?
            if (i >= input.byteLength) {
                done = true;
            }
        }
    }

    // add in the final padding marker(s)
    const paddingRequired = (
        base62.QUANTUMS_REQUIRED
        - (retval.length % base62.QUANTUMS_REQUIRED)
    ) % base62.QUANTUMS_REQUIRED;

    // console.log("PRE-PADDING LENGTH: ", retval.length);
    // console.log("PADDING REQUIRED  : ", paddingRequired);
    retval = retval + base62.PADDING.repeat(paddingRequired);

    // all done
    return retval;
}

export function base62ToString() {

}