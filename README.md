# JSRap

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

A Node.js module to wrap existing library functions with custom code.

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
