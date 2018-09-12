import { Options, WrapperFunction } from "./types";
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
export function FunctionWrapper(
  original: any,
  options: Options
): WrapperFunction {
  var newMethod = createFunction(original, options.async);
  newMethod.extend(options);

  return newMethod;
}
