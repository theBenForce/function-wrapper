export interface Options {
  before?: CounterFunction | Array<CounterFunction>;
  after?: CounterFunction | Array<CounterFunction>;
  exceptionHandler?: CounterFunction | Array<CounterFunction>;
  filterResults?: CounterFunction | Array<CounterFunction>;
  removeBefore?: CounterFunction | Array<CounterFunction>;
  [key: string]: Array<CounterFunction> | CounterFunction | undefined;
}

export interface CounterFunction {
  (): any;
  removeAfter?: number;
  toDelete?: boolean;
}

export interface WrapperOptions {
  before: Array<CounterFunction>;
  exceptionHandler: Array<CounterFunction>;
  after: Array<CounterFunction>;
  filterResults: Array<CounterFunction>;
  [key: string]: Array<CounterFunction>;
}

export interface WrapperParameters {
  wrapperOptions: WrapperOptions;
  callCount: number;
  original: any;
}

export interface WrapperFunction {
  (...args: any[]): any;
  extend(options: Options): void;
  params?: WrapperParameters;
}
