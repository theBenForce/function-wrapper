interface Options {
  before?: CounterFunction;
  after?: Function;
  exceptionHandler?: Function;
  filterResults?: Function;
  removeBefore?: number;
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

export { Options, CounterFunction, WrapperOptions };
