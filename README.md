# JSRap

A Node.js module to wrap existing library functions with custom code.

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges) [![Downloads/week](https://img.shields.io/npm/dw/jsrap.svg)](https://npmjs.org/package/jsrap) [![Build Status](https://travis-ci.org/theBenForce/function-wrapper.svg?branch=master)](https://travis-ci.org/theBenForce/function-wrapper) [![Coverage Status](https://coveralls.io/repos/github/theBenForce/function-wrapper/badge.svg?branch=master)](https://coveralls.io/github/theBenForce/function-wrapper?branch=master) [![Test Coverage](https://api.codeclimate.com/v1/badges/71adf292542d035db4ea/test_coverage)](https://codeclimate.com/github/theBenForce/function-wrapper/test_coverage) [![Maintainability](https://api.codeclimate.com/v1/badges/71adf292542d035db4ea/maintainability)](https://codeclimate.com/github/theBenForce/function-wrapper/maintainability)

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
