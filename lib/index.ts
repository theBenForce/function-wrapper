function cleanWrapperMethods(methods: Array<CounterFunction>) {
  for (var i = 0; i < methods.length; i++) {
    if (methods[i].toDelete) {
      delete methods[i];
      i--;
    }
  }
}

interface Options {
  before: CounterFunction;
  after: Function;
  exceptionHandler: Function;
  filterResults: Function;
  removeBefore: number;
}

interface CounterFunction {
  (): any;
  removeAfter?: number;
  toDelete?: boolean;
}

interface WrapperOptions {
  before: Array<CounterFunction>;
  exceptionHandler: Array<Function>;
  after: Array<Function>;
  filterResults: Array<Function>;
}

function createWrapperOptions(): WrapperOptions {
  return {
    before: [],
    exceptionHandler: [],
    after: [],
    filterResults: []
  };
}

/**
 * Executes code before or after the given method.
 * @param {*} target The class who's prototype will be modified
 * @param {String} method The method to be modified
 * @param {Options} options An object containing before, after, filterResults, and/or exceptionHandler methods.
 */
export default function FunctionWrapper(
  target: any,
  method: string,
  options: Options
) {
  const original = target.prototype[method];

  options = options || {};
  var before = options.before;
  var exceptionHandler = options.exceptionHandler;
  var after = options.after;
  var filterResults = options.filterResults;

  if (before && options.removeBefore) {
    before.removeAfter = options.removeBefore;
  }

  if (!original) {
    throw `Target does not contain method ${method}`;
  }

  if (!original.wrapperOptions) {
    original.wrapperOptions = createWrapperOptions();

    original.callCount = 0;

    target.prototype[method] = function() {
      original.callCount++;

      var args = new Array(arguments);
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
            exceptionHandler.apply(this, args.concat([ex]));
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
  }

  if (before) {
    original.wrapperOptions.before.push(before);
  }

  if (exceptionHandler) {
    original.wrapperOptions.exceptionHandler.push(exceptionHandler);
  }

  if (after) {
    original.wrapperOptions.after.push(after);
  }

  if (filterResults) {
    original.wrapperOptions.filterResults.push(filterResults);
  }
}
