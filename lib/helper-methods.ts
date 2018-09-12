import { WrapperFunction, WrapperParameters } from "./types";
import WrapperOptions from "./wrapperOptions";
import AsyncWrapperOptions, { isAsyncMethod } from "./asyncWrapperOptions";

function isWrapperFunction(
  original: Function | WrapperFunction
): original is WrapperFunction {
  return (<WrapperFunction>original).params !== undefined;
}

export default function createFunction(
  original: Function | WrapperFunction,
  async: boolean = false
): WrapperFunction {
  if (isWrapperFunction(original)) {
    return original;
  }
  var params = <WrapperParameters>{
    wrapperOptions: CreateWrapperOptions(original, async),
    callCount: 0,
    original
  };

  let newMethod = createExecutor(params, original, async) as WrapperFunction;
  newMethod.extend = params.wrapperOptions.extend.bind(params.wrapperOptions);
  newMethod.params = params;

  return newMethod;
}

export function CreateWrapperOptions(
  original: Promise<any> | Function,
  async: boolean = false
) {
  if (isAsyncMethod(original) || async) {
    return new AsyncWrapperOptions();
  }

  return new WrapperOptions();
}

export function createExecutor(
  params: WrapperParameters,
  original: Function,
  async?: boolean
): (...args: any[]) => any {
  if (!async) {
    return function(this: any, ...args: any[]) {
      params.callCount++;
      let result = params.wrapperOptions.execute(this, params.original, args);
      params.wrapperOptions.cleanupMethods(params.callCount);

      return result;
    };
  } else {
    return async function(this: any, ...args: any[]) {
      params.callCount++;
      let result = await params.wrapperOptions.execute(
        this,
        params.original,
        args
      );
      params.wrapperOptions.cleanupMethods(params.callCount);

      return result;
    };
  }
}
