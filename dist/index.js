"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cleanWrapperMethods(methods) {
    for (var i = 0; i < methods.length; i++) {
        if (methods[i].toDelete) {
            delete methods[i];
            i--;
        }
    }
}
function createWrapperOptions() {
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
function FunctionWrapper(target, method, options) {
    var original = target.prototype[method];
    options = options || {};
    var before = options.before;
    var exceptionHandler = options.exceptionHandler;
    var after = options.after;
    var filterResults = options.filterResults;
    if (before && options.removeBefore) {
        before.removeAfter = options.removeBefore;
    }
    if (!original) {
        throw "Target does not contain method " + method;
    }
    if (!original.wrapperOptions) {
        original.wrapperOptions = createWrapperOptions();
        original.callCount = 0;
        target.prototype[method] = function () {
            var _this = this;
            original.callCount++;
            var args = new Array(arguments);
            var result;
            original.wrapperOptions.before.forEach(function (before) {
                args = before.apply(_this, args);
                if (before.removeAfter && before.removeAfter >= original.callCount) {
                    before.toDelete = true;
                }
            });
            cleanWrapperMethods(original.wrapperOptions.before);
            args = args || arguments;
            try {
                result = original.apply(this, args);
            }
            catch (ex) {
                original.wrapperOptions.exceptionHandler.forEach(function (exceptionHandler) {
                    exceptionHandler.apply(_this, args.concat([ex]));
                });
            }
            original.wrapperOptions.after.forEach(function (after) {
                result = after.apply(_this, args) || result;
            });
            original.wrapperOptions.filterResults.forEach(function (filterResults) {
                result = filterResults.call(_this, result);
            });
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
exports.default = FunctionWrapper;
