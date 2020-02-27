# CHANGELOG

## Introduction

This CHANGELOG tells you:

* when a release was made
* what is in each release

It also tells you what changes have been completed, and will be included in the next tagged release.

For each release, changes are grouped under these headings:

* _Backwards-Compatibility Breaks_: a list of any backwards-compatibility breaks
* _New_: a list of new features. If the feature came from a contributor via a PR, make sure you link to the PR and give them a mention here.
* _Fixes_: a list of bugs that have been fixed. If there's an issue for the bug, make sure you link to the GitHub issue here.
* _Dependencies_: a list of dependencies that have been added / updated / removed.
* _Tools_: a list of bundled tools that have been added / updated / removed.

## develop branch

The following changes have been completed, and will be included in the next tagged release.

## v0.0.1

Released Thursday, 27th February 2020.

### New

* Added `base32UrlEncodeFromBuffer()` data transform
* Added `base32UrlEncodeFromString()` data transform
* Added `base36UrlEncodeFromBuffer()` data transform
* Added `base36UrlEncodeFromString()` data transform
* Added `base64UrlEncodeFromBuffer()` data transform
* Added `base64UrlEncodeFromString()` data transform
* Added `InvalidBase32UrlError` error class
* Added `InvalidBase36UrlError` error class
* Added `InvalidBase64UrlError` error class
* Added `isBase32UrlData()` data guard
* Added `isBase36UrlData()` data guard
* Added `isBase64UrlData()` data guard
* Added `mustBeBase32UrlData()` data guarantee
* Added `mustBeBase36UrlData()` data guarantee
* Added `mustBeBase64UrlData()` data guarantee

### Dependencies

* Added `@ganbarodigital/ts-lib-error-reporting`
* Added `@ganbarodigital/ts-lib-http-types`
* Added `@ganbarodigital/ts-lib-packagename`