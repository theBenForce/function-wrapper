export interface Options {
  before?: CounterFunction | Array<CounterFunction>;
  after?: CounterFunction | Array<CounterFunction>;
  exceptionHandler?: CounterFunction | Array<CounterFunction>;
  filterResults?: CounterFunction | Array<CounterFunction>;
  removeBefore?: CounterFunction | Array<CounterFunction>;
  [key: string]: Array<CounterFunction> | CounterFunction | undefined;
}

export interface CounterFunction {
  (...args: any[]): any;
  removeAfter?: number;
}

enum HandlerNames {
  Before = "before",
  ExceptionHandler = "exceptionHandler",
  After = "after",
  FilterResults = "filterResults"
}

interface HandlerReference {
  [key: string]: Array<CounterFunction>;
}

export class WrapperOptions {
  private handlers: HandlerReference;

  constructor() {
    this.handlers = <HandlerReference>{};
    this.handlers[HandlerNames.Before] = new Array<CounterFunction>();
    this.handlers[HandlerNames.ExceptionHandler] = new Array<CounterFunction>();
    this.handlers[HandlerNames.After] = new Array<CounterFunction>();
    this.handlers[HandlerNames.FilterResults] = new Array<CounterFunction>();
  }

  private appendHandlers(
    name: HandlerNames,
    handlers: CounterFunction | Array<CounterFunction> | undefined
  ): void {
    if (handlers === undefined) {
      return;
    }

    var target = this.handlers[name];

    if (target === undefined) {
      throw new Error(`Unknown handler name: ${name}`);
    }

    if (!Array.isArray(handlers)) {
      target.push(handlers);
    } else {
      handlers.forEach(x => target.push(x));
    }
  }

  execute(self: any, original: Function, args: any[]) {
    let result: any;

    args = this.runMethods(HandlerNames.Before, self, args) || args;

    try {
      result = original.apply(self, args);
    } catch (ex) {
      let exArgs = [ex].concat(args);
      result =
        this.runMethods(HandlerNames.ExceptionHandler, self, exArgs) || result;
    }

    result = this.runMethods(HandlerNames.After, self, args) || result;
    result =
      this.runMethods(HandlerNames.FilterResults, self, [result]) || result;
  }

  private runMethods(
    handler: HandlerNames,
    self: any,
    args: any[]
  ): any | any[] {
    let result: any;

    this.handlers[handler].forEach(
      h => (result = h.apply(self, args) || result)
    );

    return result;
  }

  extend(options: Options): void {
    for (var name of Object.values(HandlerNames)) {
      this.appendHandlers(name, options[name]);
    }
  }

  cleanupMethods(callCount: number): void {
    for (var name of Object.values(HandlerNames)) {
      this.handlers[name] = this.handlers[name].filter(
        x => x.removeAfter === undefined || callCount < x.removeAfter
      );
    }
  }
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
