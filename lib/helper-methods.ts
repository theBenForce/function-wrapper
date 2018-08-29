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
    wrapperOptions: createWrapperOptions(),
    callCount: 0,
    original
  };

  let newMethod = <WrapperFunction>createExecutor(params, original);
  newMethod.extend = createExtendor(params.wrapperOptions);
  newMethod.params = params;

  return newMethod;
}

function smartCopy(
  source: Options,
  wrapperOptions: WrapperOptions,
  name: string
) {
  var x = source[name];

  if (!x) {
    return;
  }

  if (Array.isArray(x)) {
    for (var y of x) {
      wrapperOptions[name].push(y);
    }
  } else {
    wrapperOptions[name].push(x);
  }
}

export function createExtendor(wrapperOptions: WrapperOptions) {
  return (options: Options): void => {
    for (var name of ["before", "exceptionHandler", "after", "filterResults"]) {
      smartCopy(options, wrapperOptions, name);
    }
  };
}

export function createExecutor(
  params: WrapperParameters,
  original: Function
): (...args: any[]) => any {
  return function(this: any, ...args: any[]) {
    params.callCount++;
    let result: any;
    args = runPreMethods.call(this, params, args);
    result = runOriginal.call(this, params, args);
    result = runPostMethods.call(this, params, args, result);
    return result;
  };
}

export function cleanWrapperMethods(methods: Array<CounterFunction>) {
  for (var i = 0; i < methods.length; i++) {
    if (methods[i] && methods[i].toDelete) {
      delete methods[i];
      i--;
    }
  }
}

export function createWrapperOptions(): WrapperOptions {
  return {
    before: [],
    exceptionHandler: [],
    after: [],
    filterResults: []
  };
}

export function runOriginal(this: any, params: WrapperParameters, args: any) {
  let result: any;
  let original = params.original;
  let wrapperOptions = params.wrapperOptions;

  try {
    result = original.apply(this, args);
  } catch (ex) {
    var exArgs = [ex].concat(args);
    wrapperOptions.exceptionHandler.forEach((exceptionHandler: Function) => {
      result = exceptionHandler.apply(this, exArgs) || result;
    });
  }
  return result;
}

export function runPreMethods(
  this: any,
  params: WrapperParameters,
  args: any,
  callCount: number
) {
  let wrapperOptions = params.wrapperOptions;
  wrapperOptions.before.forEach((before: CounterFunction) => {
    args = before.apply(this, args) || args;
    if (before.removeAfter && before.removeAfter >= callCount) {
      before.toDelete = true;
    }
  });
  cleanWrapperMethods(wrapperOptions.before);

  return args;
}

export function runPostMethods(
  this: any,
  params: WrapperParameters,
  result: any,
  args: any
) {
  let wrapperOptions = params.wrapperOptions;

  wrapperOptions.after.forEach((after: Function) => {
    result = after.apply(this, args) || result;
  });
  wrapperOptions.filterResults.forEach((filterResults: Function) => {
    result = filterResults.call(this, result);
  });
  return result;
}
