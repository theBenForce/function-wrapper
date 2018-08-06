jest.disable;

const { PrototypeWrapper } = require("../dist/index");

class Target {}
var original = jest.fn();
Target.prototype.original = function() {
  original();
};

test("wrapping unknown method to throw an exception", () => {
  expect(() => PrototypeWrapper(Target, "something")).toThrow();
});

test("before method should be run before function", () => {
  var before = jest.fn(() => expect(original.mock.calls.length).toEqual(0));

  PrototypeWrapper(Target, "original", { before });

  var target = new Target();
  target.original();

  expect(before.mock.calls.length).toEqual(1);
  expect(original.mock.calls.length).toEqual(1);
});

test("after method should be run after function", () => {
  var after = jest.fn(function() {
    expect(original.mock.calls.length).toEqual(1);
  });

  PrototypeWrapper(Target, "original", { after });

  var target = new Target();
  target.original();

  expect(after.mock.calls.length).toEqual(1);
  expect(original.mock.calls.length).toEqual(1);
});

test("exceptionHandler method should be run when an exception is thrown", () => {
  var originalException = jest.fn(() => {
    throw "test exception";
  });
  Target.prototype.originalException = originalException;

  var exceptionHandler = jest.fn();

  PrototypeWrapper(Target, "originalException", { exceptionHandler });

  var target = new Target();
  target.originalException();

  expect(exceptionHandler.mock.calls.length).toEqual(1);
});

test("filter results method should be run after function", () => {
  var filterResults = jest.fn();

  PrototypeWrapper(Target, "original", { filterResults });

  var target = new Target();
  target.original();

  expect(filterResults.mock.calls.length).toEqual(1);
  expect(original.mock.calls.length).toEqual(1);
});
