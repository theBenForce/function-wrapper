import {
  CounterFunction,
  WrapperOptions,
  WrapperFunction,
  WrapperParameters,
  Options
} from "./types";

function isWrapperFunction(
  original: Function | WrapperFunction
): original is WrapperFunction {
  return (<WrapperFunction>original).params !== undefined;
}

export default function createFunction(
  original: Function | WrapperFunction
): WrapperFunction {
  if (isWrapperFunction(original)) {
    return original;
  }
  var params = <WrapperParameters>{
    wrapperOptions: new WrapperOptions(),
    callCount: 0,
    original
  };

  let newMethod = <WrapperFunction>createExecutor(params, original);
  newMethod.extend = params.wrapperOptions.extend.bind(params.wrapperOptions);
  newMethod.params = params;

  return newMethod;
}

export function createExecutor(
  params: WrapperParameters,
  original: Function
): (...args: any[]) => any {
  return function(this: any, ...args: any[]) {
    params.callCount++;
    let result = params.wrapperOptions.execute(this, params.original, args);
    params.wrapperOptions.cleanupMethods(params.callCount);

    return result;
  };
}
