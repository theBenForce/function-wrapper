# JSRap

A Node.js module to wrap existing library functions with custom code.

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges) [![Build Status](https://travis-ci.org/theBenForce/function-wrapper.svg?branch=master)](https://travis-ci.org/theBenForce/function-wrapper) [![Coverage Status](https://coveralls.io/repos/github/theBenForce/function-wrapper/badge.svg?branch=master)](https://coveralls.io/github/theBenForce/function-wrapper?branch=master)

## Installation

```sh
npm i jsrap
```

## Usage

```javascript
var FunctionWrapper = require("jsrap");
var Target = require("some-class");

FunctionWrapper(Target, "someMethod", {
  before() {
    console.info("Executed before someMethod");
  },
  after() {
    console.info("Executed after someMethod");
  }
});
```
