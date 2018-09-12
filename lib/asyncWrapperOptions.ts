import WrapperOptions from "./wrapperOptions";
import { HandlerNames, CounterFunction } from "./types";

export function isAsyncMethod(method: any): boolean {
  if (!method.constructor) {
    return false;
  }

  const name = method.constructor.name;

  return name === "AsyncFunction" || name === "Promise";
}

export default class AsyncWrapperOptions extends WrapperOptions {
  constructor() {
    super();
  }

  async execute(self: any, original: Function, args: any[]): Promise<any> {
    let result: any;

    const beforeArgs =
      (await this.runMethods(HandlerNames.Before, self, args)) || args;

    try {
      result = await original.apply(self, beforeArgs);
    } catch (ex) {
      let exArgs = [ex].concat(beforeArgs);
      result =
        (await this.runMethods(HandlerNames.ExceptionHandler, self, exArgs)) ||
        result;
    }

    result =
      (await this.runMethods(HandlerNames.After, self, beforeArgs)) || result;
    result =
      (await this.runMethods(HandlerNames.FilterResults, self, [result])) ||
      result;

    return result;
  }

  protected async runMethods(
    handler: HandlerNames,
    self: any,
    args: any[]
  ): Promise<any> {
    let result: any = args;
    const handlers = this.handlers[handler];

    if (handlers.length === 0) {
      return undefined;
    }

    for (const handler of handlers) {
      if (isAsyncMethod(handler)) {
        result = (await handler.apply(self, result)) || result;
      } else {
        const value = handler.apply(self, args);
        result = value || result;
      }
    }

    return result;
  }
}
