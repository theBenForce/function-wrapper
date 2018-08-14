import { CounterFunction, WrapperOptions } from "./types";

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

export default function createFunction(original: any) {
  var newMethod = original;
  if (!original.wrapperOptions) {
    newMethod = function(this: any) {
      original.callCount++;
      var args = Array.prototype.slice.call(arguments);
      let result: any;
      original.wrapperOptions.before.forEach((before: CounterFunction) => {
        args = before.apply(this, args);
        if (before.removeAfter && before.removeAfter >= original.callCount) {
          before.toDelete = true;
        }
      });
      cleanWrapperMethods(original.wrapperOptions.before);
      args = args || arguments;
      try {
        result = original.apply(this, args);
      } catch (ex) {
        original.wrapperOptions.exceptionHandler.forEach(
          (exceptionHandler: Function) => {
            result = exceptionHandler.apply(this, args.concat([ex]));
          }
        );
      }
      original.wrapperOptions.after.forEach((after: Function) => {
        result = after.apply(this, args) || result;
      });
      original.wrapperOptions.filterResults.forEach(
        (filterResults: Function) => {
          result = filterResults.call(this, result);
        }
      );
      return result;
    };
    newMethod.wrapperOptions = createWrapperOptions();
    newMethod.callCount = 0;
  }
  return newMethod;
}
