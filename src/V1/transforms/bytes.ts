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

type QUANTUM_PROCESSOR = () => void;

export function base62FromBytes(input: Buffer): string {
    const TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");

    let bufferOffset = 0;
    let retval = "";
    let currentByte = 0;
    let bitGroup = 0;
    let bitGroupCarry = 0;
    let bitGroupCount = 0;

    const maxBitGroups = Math.ceil(input.byteLength * 8 / 6);
    let qpI = 0;

    const readByte = (): QUANTUM_PROCESSOR  => {
        return () => {
            // console.log("readByte()");
            if (bufferOffset < input.byteLength) {
                currentByte = input[bufferOffset];
            } else {
                currentByte = 0;
            }
        };
    };

    const incBufferOffset = (): QUANTUM_PROCESSOR => {
        return () => {
            // console.log("incBufferOffset()");
            bufferOffset++;
        };
    };

    const extractBitGroup = (bitmask: number, rotation: number): QUANTUM_PROCESSOR => {
        return () => {
            // console.log("extractBitGroup(" + bitmask.toString(2) + ", " + rotation + ")");
            // tslint:disable-next-line: no-bitwise
            bitGroup = ((bitGroupCarry + currentByte) & bitmask) >>> rotation;
            bitGroupCarry = 0;

            // tslint:disable-next-line: no-bitwise
            currentByte = currentByte - (currentByte & bitmask);
        };
    };

    const translateBitGroup = (): QUANTUM_PROCESSOR => {
        return () => {
            // console.log("translateBitGroup()");
            retval = retval + TABLE[bitGroup];
        };
    };

    const incBitGroupCount = (): QUANTUM_PROCESSOR => {
        return () => {
            // console.log("incBitGroupIndex()");
            bitGroupCount++;
        };
    };

    const calculateQuantumCarry = (): QUANTUM_PROCESSOR => {
        return () => {
            // console.log("calculateBitGroupCarry()");
            bitGroupCarry = currentByte * 256;
        };
    };

    // const incQuantumCount = (): QUANTUM_PROCESSOR => {
    //     return () => {
    //         currentQuantum++;
    //     };
    // };

    const processInstruction = () => {
        // console.log();
        QUANTUM_PROCESSING[qpI]();

        // console.log("INSTRUCTION #" + qpI);
        // console.log("  BUFFER LENGTH:", input.byteLength);
        // console.log("  CURRENT BYTE :", currentByte.toString(2));
        // console.log("  BUFFER OFFSET:", bufferOffset);
        // console.log("  QUANTUM      :", bitGroup.toString(2));
        // console.log("  QUANTUM CARRY:", bitGroupCarry.toString(2));

        qpI = (qpI + 1) % QUANTUM_PROCESSING.length;
    };

    // a table of instructions to process all the quantums held
    // in a 3-byte block
    const QUANTUM_PROCESSING = [
        readByte(),
        extractBitGroup(63 << 2, 2),
        translateBitGroup(),
        calculateQuantumCarry(),
        incBitGroupCount(),
        incBufferOffset(),
        readByte(),
        extractBitGroup(63 << 4, 4),
        translateBitGroup(),
        calculateQuantumCarry(),
        incBitGroupCount(),
        incBufferOffset(),
        readByte(),
        extractBitGroup(63 << 6, 6),
        translateBitGroup(),
        incBitGroupCount(),
        extractBitGroup(63, 0),
        translateBitGroup(),
        incBitGroupCount(),
        incBufferOffset(),
        // incQuantumCount(),
    ];

    while (bitGroupCount < maxBitGroups) {
        processInstruction();
    }

    const paddingRequired = (
        4
        - (retval.length % 4)
    ) % 4;

    retval = retval + "=".repeat(paddingRequired);

    // all done
    return retval;
}

export function base62ToBytes() {

}