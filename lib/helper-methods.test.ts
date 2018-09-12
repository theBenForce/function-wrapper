import createFunction from "./helper-methods";
import { CreateWrapperOptions } from "./helper-methods";
import AsyncWrapperOptions from "./asyncWrapperOptions";

describe("Helper Methods", () => {
  test("proper arguments are passed to original", () => {
    var original = jest.fn();

    var newFunction = createFunction(original);

    newFunction(1, 2, 3);

    expect(original).toHaveBeenCalledWith(1, 2, 3);
  });

  test("create AsyncWrapperOptions when promise is passed in", () => {
    const original = async function() {
      return "Test";
    };

    const wrapperOptions = CreateWrapperOptions(original);
    expect(wrapperOptions instanceof AsyncWrapperOptions).toBeTruthy();
  });

  test("exception handler is called with args and exception", () => {
    var original = jest.fn(() => {
      throw "something went wrong";
    });
    var handleEx = jest.fn();

    var newFunction = createFunction(original);
    newFunction.extend({
      exceptionHandler: handleEx,
      before: jest.fn()
    });

    newFunction(1);
    expect(handleEx).toHaveBeenCalledWith("something went wrong", 1);
  });
});
