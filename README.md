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

## Methods

All of the following methods may be passed in the options object.

### `before(...args: any[]): any[]`

The before method is called with all of the arguments of the original function passed in. Your implementation must either return the arguments array, or `void`.

### `exceptionHandler(exception: any, ...args: any[]): any`

This method is called whenever an exception is thrown by the original method. It's return value is saved as the method result if it's not `void`.

### `after(...args: any[]): any`

This method is called after the original method has completed. All of the original arguments are passed to it, and it can return `void` or some other value that will be used as the method result. If `void` is returned, the previous result value is saved.

### `filterResults(result: any): any`

Allows you to modify the results before returning. Whatever is returned from this function is used as the final result.
