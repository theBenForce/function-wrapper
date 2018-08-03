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
/**
 * Executes code before or after the given method.
 * @param {*} target The class who's prototype will be modified
 * @param {String} method The method to be modified
 * @param {Options} options An object containing before, after, filterResults, and/or exceptionHandler methods.
 */
export default function FunctionWrapper(target: any, method: string, options: Options): void;
export {};
