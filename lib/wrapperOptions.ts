import {
  HandlerReference,
  HandlerNames,
  CounterFunction,
  Options
} from "./types";

export default class WrapperOptions {
  protected handlers: HandlerReference;

  constructor() {
    this.handlers = <HandlerReference>{};
    this.handlers[HandlerNames.Before] = new Array<CounterFunction>();
    this.handlers[HandlerNames.ExceptionHandler] = new Array<CounterFunction>();
    this.handlers[HandlerNames.After] = new Array<CounterFunction>();
    this.handlers[HandlerNames.FilterResults] = new Array<CounterFunction>();
  }

  protected appendHandlers(
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

    const beforeArgs = this.runMethods(HandlerNames.Before, self, args) || args;

    try {
      result = original.apply(self, beforeArgs);
    } catch (ex) {
      let exArgs = [ex].concat(args);
      result =
        this.runMethods(HandlerNames.ExceptionHandler, self, exArgs) || result;
    }

    result = this.runMethods(HandlerNames.After, self, args) || result;
    result =
      this.runMethods(HandlerNames.FilterResults, self, [result]) || result;

    return result;
  }

  protected runMethods(
    handler: HandlerNames,
    self: any,
    args: any[]
  ): any | any[] {
    let result: any;
    const handlers = this.handlers[handler];

    for (const handler of handlers) {
      result = handler.apply(self, args) || result;
    }

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
