import { Options, CounterFunction, WrapperOptions } from "./types";
import createFunction from "./helper-methods";

/**
 * Executes code before or after the given method.
 * @param {*} target The class who's prototype will be modified
 * @param {String} method The method to be modified
 * @param {Options} options An object containing before, after, filterResults, and/or exceptionHandler methods.
 */
export function PrototypeWrapper(
  target: any,
  method: string,
  options: Options
) {
  const original = target.prototype[method];

  if (!original) {
    throw `Target does not contain method ${method}`;
  }

  target.prototype[method] = FunctionWrapper(original, options);
}

/**
 * Executes code before or after the given method.
 * @param {*} target The function to be extended
 * @param {Options} options An object containing before, after, filterResults, and/or exceptionHandler methods.
 */
export function FunctionWrapper(original: any, options: Options): Function {
  options = options || {};
  var before = options.before;
  var exceptionHandler = options.exceptionHandler;
  var after = options.after;
  var filterResults = options.filterResults;

  if (before && options.removeBefore) {
    before.removeAfter = options.removeBefore;
  }

  var newMethod = createFunction(original);

  if (before) {
    newMethod.wrapperOptions.before.push(before);
  }

  if (exceptionHandler) {
    newMethod.wrapperOptions.exceptionHandler.push(exceptionHandler);
  }

  if (after) {
    newMethod.wrapperOptions.after.push(after);
  }

  if (filterResults) {
    newMethod.wrapperOptions.filterResults.push(filterResults);
  }

  return newMethod;
}
