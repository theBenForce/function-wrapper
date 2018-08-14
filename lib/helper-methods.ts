import { CounterFunction, WrapperOptions } from "./types";

export default function createFunction(original: any) {
  var newMethod = original;
  if (!original.wrapperOptions) {
    var wrapperOptions = createWrapperOptions();
    var callCount = 0;
    newMethod = function(this: any) {
      callCount++;
      var args = Array.prototype.slice.call(arguments);
      let result: any;
      args = runPreMethods.call(this, wrapperOptions, args, callCount);
      result = runOriginal.call(this, result, original, args, wrapperOptions);
      result = runPostMethods.call(this, wrapperOptions, result, args);
      return result;
    };
    newMethod.wrapperOptions = wrapperOptions;
    newMethod.callCount = callCount;
  }
  return newMethod;
}

function cleanWrapperMethods(methods: Array<CounterFunction>) {
  for (var i = 0; i < methods.length; i++) {
    if (methods[i] && methods[i].toDelete) {
      delete methods[i];
      i--;
    }
  }
}

function createWrapperOptions(): WrapperOptions {
  return {
    before: [],
    exceptionHandler: [],
    after: [],
    filterResults: []
  };
}

function runOriginal(
  this: any,
  result: any,
  original: any,
  args: any,
  wrapperOptions: WrapperOptions
) {
  try {
    result = original.apply(this, args);
  } catch (ex) {
    wrapperOptions.exceptionHandler.forEach((exceptionHandler: Function) => {
      result = exceptionHandler.apply(this, args.concat([ex]));
    });
  }
  return result;
}

function runPreMethods(
  this: any,
  wrapperOptions: WrapperOptions,
  args: any,
  callCount: number
) {
  wrapperOptions.before.forEach((before: CounterFunction) => {
    args = before.apply(this, args);
    if (before.removeAfter && before.removeAfter >= callCount) {
      before.toDelete = true;
    }
  });
  cleanWrapperMethods(wrapperOptions.before);
  args = args || arguments;
  return args;
}

function runPostMethods(
  this: any,
  wrapperOptions: WrapperOptions,
  result: any,
  args: any
) {
  wrapperOptions.after.forEach((after: Function) => {
    result = after.apply(this, args) || result;
  });
  wrapperOptions.filterResults.forEach((filterResults: Function) => {
    result = filterResults.call(this, result);
  });
  return result;
}
