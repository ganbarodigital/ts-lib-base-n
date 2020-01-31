'use strict'
var benchmark = require('benchmark')
var bsN = require("../lib/V1/transforms");
var fs = require('fs')
var BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
var bsX64 = require('base-x')(BASE64)
var BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
var bsX32 = require('base-x')(BASE32)

// we're going to have two sets of fixtures:
//
// 1) encoding UUIDs
// 2) encoding larger blocks of input

class Fixture {
    index = 0;
    fixtures = new Array();

    getNextFixture() {
        var retval = this.fixtures[this.index];
        if (this.index === this.fixtures.length) {
           this.fixtures.length = 0;
        }

        return retval;
    }

    resetIndex() {
        this.index = 0;
    }
}

var uuidFixtures = new Fixture();
uuidFixtures.fixtures.push(Buffer.from("306af19c-41a4-4b21-8572-32308e6c03ea"));
uuidFixtures.fixtures.push(Buffer.from("51ecae04-1c6f-4dbf-9f53-2ca1559ca3c7"));
uuidFixtures.fixtures.push(Buffer.from("45d42716-5339-4641-a343-a8b99ee1038d"));
uuidFixtures.fixtures.push(Buffer.from("f5ff6fb3-afd2-4e58-8a6e-3e27eedd89d8"));
uuidFixtures.fixtures.push(Buffer.from("85286065-9990-445c-9408-53ab382ccabe"));
uuidFixtures.fixtures.push(Buffer.from("814d1bdf-9764-4160-ac0f-781b8ce3fb14"));
uuidFixtures.fixtures.push(Buffer.from("d37a94ca-a779-4b84-87eb-89c1fa72e96d"));
uuidFixtures.fixtures.push(Buffer.from("3f699e33-013f-42bb-9737-01ac814d6874"));

var largeFixtures = new Fixture();
largeFixtures.fixtures.push(Buffer.from(fs.readFileSync("AUTHORS.md", 'utf-8')));
largeFixtures.fixtures.push(Buffer.from(fs.readFileSync("CHANGELOG.md", 'utf-8')));
largeFixtures.fixtures.push(Buffer.from(fs.readFileSync("CODE-OF-CONDUCT.md", 'utf-8')));
largeFixtures.fixtures.push(Buffer.from(fs.readFileSync("CONTRIBUTING.md", 'utf-8')));
largeFixtures.fixtures.push(Buffer.from(fs.readFileSync("LICENSE.md", 'utf-8')));
largeFixtures.fixtures.push(Buffer.from(fs.readFileSync("MAINTAINERS.md", 'utf-8')));
largeFixtures.fixtures.push(Buffer.from(fs.readFileSync("README.md", 'utf-8')));

// this is a 'reference implementation' that we found online
//
// it's a reasonable baseline to try and beat
function baseline_base64_encode (s)
{
  // the result/encoded string, the padding string, and the pad count
  var base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var r = "";
  var p = "";
  var c = s.length % 3;

  // add a right zero pad to make this string a multiple of 3 characters
  if (c > 0) {
    for (; c < 3; c++) {
      p += '=';
      s += "\0";
    }
  }

  // increment over the length of the string, three characters at a time
  for (c = 0; c < s.length; c += 3) {

    // we add newlines after every 76 output characters, according to the MIME specs
    // if (c > 0 && (c / 3 * 4) % 76 == 0) {
    //   r += "\r\n";
    // }

    // these three 8-bit (ASCII) characters become one 24-bit number
    var n = (s.charCodeAt(c) << 16) + (s.charCodeAt(c+1) << 8) + s.charCodeAt(c+2);

    // this 24-bit number gets separated into four 6-bit numbers
    n = [(n >>> 18) & 63, (n >>> 12) & 63, (n >>> 6) & 63, n & 63];

    // those four 6-bit numbers are used as indices into the base64 character list
    r =+ base64chars[n[0]] + base64chars[n[1]] + base64chars[n[2]] + base64chars[n[3]];
  }
   // add the actual padding string, after removing the zero pad
  return r.substring(0, r.length - p.length) + p;
}

benchmark.options.minTime = 1;

class MyBenchmark {
    constructor(banner, fixtures) {
        this.benchmark = new benchmark.Suite({
            onStart: function () {
                console.log("==================================================");
                console.log(banner);
                console.log("--------------------------------------------------");
            },
            onCycle: function (event) {
                console.log(String(event.target))
            },
            onError: function (event) {
                console.error(event.target.error)
            },
            onComplete: function () {
                console.log("--------------------------------------------------")
            }
        });

        this.benchmark.add('baseline (wikibooks)   ', function () {
            var fixture = fixtures.getNextFixture();
            baseline_base64_encode(fixture.toString());
        }, {onStart: fixtures.resetIndex, onCycle: fixtures.resetIndex});
        this.benchmark.add('base-x (base64 buffer) ', function () {
            var fixture = fixtures.getNextFixture();
            bsX64.encode(fixture);
        }, {onStart: fixtures.resetIndex, onCycle: fixtures.resetIndex});
        this.benchmark.add('base-x (base32 buffer) ', function () {
            var fixture = fixtures.getNextFixture();
            bsX64.encode(fixture);
        }, {onStart: fixtures.resetIndex, onCycle: fixtures.resetIndex});
        this.benchmark.add('base-n (base64 buffer) ', function () {
            var fixture = fixtures.getNextFixture()
            bsN.base64UrlEncodeFromBuffer(fixture);
        }, {onStart: fixtures.resetIndex, onCycle: fixtures.resetIndex});
        this.benchmark.add('base-n (base64 string) ', function () {
            var fixture = fixtures.getNextFixture().toString();
            bsN.base64UrlEncodeFromString(fixture);
        }, {onStart: fixtures.resetIndex, onCycle: fixtures.resetIndex});
        this.benchmark.add('base-n (base36 buffer) ', function () {
            var fixture = fixtures.getNextFixture();
            bsN.base36UrlEncodeFromBuffer(fixture);
        }, {onStart: fixtures.resetIndex, onCycle: fixtures.resetIndex});
        this.benchmark.add('base-n (base36 string) ', function () {
            var fixture = fixtures.getNextFixture().toString();
            bsN.base36UrlEncodeFromString(fixture);
        }, {onStart: fixtures.resetIndex, onCycle: fixtures.resetIndex});
        this.benchmark.add('base-n (base32 buffer) ', function () {
            var fixture = fixtures.getNextFixture();
            bsN.base32UrlEncodeFromBuffer(fixture);
        }, {onStart: fixtures.resetIndex, onCycle: fixtures.resetIndex});
        this.benchmark.add('base-n (base32 string) ', function () {
            var fixture = fixtures.getNextFixture().toString();
            bsN.base32UrlEncodeFromString(fixture);
        }, {onStart: fixtures.resetIndex, onCycle: fixtures.resetIndex});
    }

    run() {
        this.benchmark.run();
    }
}

var uuidBenchmark = new MyBenchmark(
    "UUID conversions benchmark",
    uuidFixtures
);

var largeBenchmark = new MyBenchmark(
    "large data benchmark",
    largeFixtures
);

uuidBenchmark.run();
largeBenchmark.run();