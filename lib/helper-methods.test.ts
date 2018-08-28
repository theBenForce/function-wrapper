import createFunction from "./helper-methods";

describe("Helper Methods", () => {
  test("proper arguments are passed to original", () => {
    var original = jest.fn();

    var newFunction = createFunction(original);

    newFunction(1, 2, 3);

    expect(original).toHaveBeenCalledWith(1, 2, 3);
  });

  test("exception handler is called with args and exception", () => {
    var original = jest.fn(() => {
      throw "something went wrong";
    });
    var handleEx = jest.fn();

    var newFunction = createFunction(original);
    newFunction.params.wrapperOptions.exceptionHandler.push(handleEx);
    newFunction.params.wrapperOptions.before.push(jest.fn());

    newFunction(1);
    expect(handleEx).toHaveBeenCalledWith(1, "something went wrong");
  });
});
