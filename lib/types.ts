import WrapperOptions from "./wrapperOptions";

export interface Options {
  before?: CounterFunction | Array<CounterFunction>;
  after?: CounterFunction | Array<CounterFunction>;
  exceptionHandler?: CounterFunction | Array<CounterFunction>;
  filterResults?: CounterFunction | Array<CounterFunction>;
  removeBefore?: CounterFunction | Array<CounterFunction>;
  [key: string]: Array<CounterFunction> | CounterFunction | boolean | undefined;
  async?: boolean;
}

export interface CounterFunction {
  (...args: any[]): any;
  removeAfter?: number;
}

export enum HandlerNames {
  Before = "before",
  ExceptionHandler = "exceptionHandler",
  After = "after",
  FilterResults = "filterResults"
}

export interface HandlerReference {
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
