# JSRap

A Node.js module to wrap existing library functions with custom code.

[![experimental](https://img.shields.io/badge/stability-experimental-red.svg)](https://github.com/theBenForce/function-wrapper) [![Downloads/week](https://img.shields.io/npm/dw/jsrap.svg)](https://npmjs.org/package/jsrap) [![Build Status](https://travis-ci.org/theBenForce/function-wrapper.svg?branch=master)](https://travis-ci.org/theBenForce/function-wrapper) [![Test Coverage](https://api.codeclimate.com/v1/badges/71adf292542d035db4ea/test_coverage)](https://codeclimate.com/github/theBenForce/function-wrapper/test_coverage) [![Maintainability](https://api.codeclimate.com/v1/badges/71adf292542d035db4ea/maintainability)](https://codeclimate.com/github/theBenForce/function-wrapper/maintainability)

## Installation

```sh
npm i jsrap
```

## Usage

```javascript
var { PrototypeWrapper } = require("jsrap");
var Target = require("some-class");

PrototypeWrapper(Target, "someMethod", {
  before() {
    console.info("Executed before someMethod");
  },
  after() {
    console.info("Executed after someMethod");
  }
});
```
