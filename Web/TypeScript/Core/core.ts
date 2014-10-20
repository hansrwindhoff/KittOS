interface Array<T> {
    flatten<U>(): U[];
    flatMap<U>(projection: (any) => U): U[];
    zip<U>(otherArray: any[], combination: (...any) => U): U[];
}

((context, undefined) => {
    Array.prototype.flatten = function () {
        var results = [];

        this.forEach((innerArray: any[]) => {
            results.push.apply(results, innerArray);
        });

        return results;
    };
    Array.prototype.flatMap = function (projectFunc) {
        return this
            .map((o) => { return projectFunc(o); })
            .flatten();
    };
    Array.prototype.zip = function (otherArray, combineFunc) {
        var counter: number;
        var length: number;
        var results = [];

        for (counter = 0, length = Math.min(this.length, otherArray.length); counter < length; counter++) {
            results.push(combineFunc(this[counter], otherArray[counter]));
        }

        return results;
    };
})(this, undefined);

module ktw {
    "use strict";

    export enum DeferredStatus {
        Pending = 0,
        Completed = 1,
        Failed = 2,
    }
    export interface IDeferred {
        handler: number;
        status: DeferredStatus;
        value: any;
    }
    export interface IIterator {
        hasNext: boolean;
        next(): any;
    }
    export interface IAsyncIterator extends IIterator { nextAsync(): IDeferred; }
    export interface IMapper<TInput, TResult> { (input: TInput): TResult; }
    export interface IPredicate { (...args: any[]): boolean; }
    export interface IReducer<TPrevious, TNext, TResult> { (previous: TPrevious, next: TNext): TResult; }

    export class Iterator<T> implements IAsyncIterator {
        private m_collection: Array<T> = [];
        private m_errorCallback: Function;
        private m_position: number = 0;

        enumerateAsync(): void { ktw.Helpers.repeat(() => { this.nextAsync(); }, this.m_errorCallback, 10, this.m_collection.length); }
        get hasNext(): boolean { return this.m_position < this.m_collection.length; }
        next(): T {
            if (this.hasNext) {
                var current: T = this.m_collection[this.m_position];

                this.m_position++;

                return current;
            }
        }
        nextAsync(): IDeferred { return Helpers.defer(() => { this.next(); }, this.m_errorCallback); }

        constructor(collection: Array<T>, errorCallback?: Function) {
            this.m_collection = collection;
            this.m_errorCallback = errorCallback;
        }
    }

    export class Helpers {
        static isArray(obj: Object): boolean {
            return Helpers.is(JsTypes.jsArray, obj);
        }
        static isFunction(obj: Object): boolean {
            return Helpers.is(JsTypes.jsFunction, obj);
        }
        static isNumber(str: string): boolean;
        static isNumber(num: number): boolean;
        static isNumber(obj: Object): boolean;
        static isNumber(obj: any): boolean {
            if (Helpers.is(JsTypes.jsNumber, obj)) { return true; } // num overload
            if (Helpers.is(JsTypes.jsString, obj)) { return !isNaN(obj); } // str overload

            return false;
        }
        static isNull(obj: Object): boolean {
            return Helpers.is(JsTypes.jsNull, obj);
        }
        static isNullOrUndefined(obj: Object): boolean {
            return Helpers.isNull(obj) || Helpers.isUndefined(obj);
        }
        static isObject(obj: Object): boolean {
            return Helpers.is(JsTypes.jsObject, obj);
        }
        static isString(obj: Object): boolean {
            return Helpers.is(JsTypes.jsString, obj);
        }
        static isUndefined(obj: Object): boolean {
            return Helpers.is(JsTypes.jsUndefined, obj);
        }

        static defer(success?: Function, failure?: Function, durationMs: number = 0): IDeferred {
            var result: IDeferred = {
                handler: undefined,
                status: DeferredStatus.Pending,
                value: undefined
            };

            result.handler = setTimeout(() => { // set handler
                try {
                    result.value = (success || Helpers.noOp).apply(null, null); // fulfill
                    result.status = DeferredStatus.Completed; // mark as completed
                } catch (e) {
                    result.value = (failure || Helpers.noOp).apply(null, [e]); // reject
                    result.status = DeferredStatus.Failed; // mark as failed
                } finally {
                    clearTimeout(result.handler); // completely unnecessary... but it feels good?
                }
            }, durationMs);

            return result;
        }
        static limit(func: Function, maxExecutions: number = 1) {
            var numExecutions: number = 0;

            return (...args: any[]) => {
                if (numExecutions < maxExecutions) {
                    numExecutions++;
                    return func.apply(null, args);
                }
            }
        }
        static noOp(): void { }
        static partial(func: Function, ...funcArgs: any[]) {
            return (...args: any[]) => {
                return func.apply(null, funcArgs.concat(args));
            }
        }
        static pipeline(...funcs: any[]): Function {
            return (...funcArgs: any[]) => {
                var applyArgs: IReducer<IArguments, Function, Array<Function>> = (args: IArguments, func: Function) => {
                    return [func.apply(null, args)];
                };

                return funcs.reduce(applyArgs, funcArgs)[0];
            }
        }
        static repeat(success?: Function, failure?: Function, intervalMs?: number, maxExecutions?: number): IDeferred {
            var numExecutions: number = 0;
            var result: IDeferred = {
                handler: undefined,
                status: DeferredStatus.Pending,
                value: undefined
            };

            result.handler = setInterval(() => {
                if (maxExecutions && numExecutions === maxExecutions) {
                    clearInterval(result.handler);
                } else {
                    try {
                        numExecutions++;
                        result.value = (success || Helpers.noOp).apply(null, null); // fulfill
                        result.status = DeferredStatus.Completed; // mark as completed
                    } catch (e) {
                        clearInterval(result.handler); // clear interval handler
                        result.value = (failure || Helpers.noOp).apply(null, [e]); // reject
                        result.status = DeferredStatus.Failed; // mark as failed
                    }
                }
            }, intervalMs || 10);

            return result;
        }
        static wrap(obj: Object): Function { return () => { return obj; } }

        static add: IReducer<number, number, number> = (n1, n2) => { return n1 + n2; };
        static subtract: IReducer<number, number, number> = (n1, n2) => { return n1 - n2; };
        static multiply: IReducer<number, number, number> = (n1, n2) => { return n1 * n2; };
        static divide: IReducer<number, number, number> = (n1, n2) => { return n1 / n2; };
        static remainder: IReducer<number, number, number> = (n1, n2) => { return n1 % n2; };
        static min: IReducer<number, number, number> = (n1, n2) => { return Math.min(n1, n2); };
        static max: IReducer<number, number, number> = (n1, n2) => { return Math.max(n1, n2); };
        static lessThan: IPredicate = (l: any, r: any) => { return l < r; };
        static greaterThan: IPredicate = (l: any, r: any) => { return l > r; };
        static equalTo: IPredicate = (l: any, r: any) => { return l === r; };

        private static getClass(obj: Object): string {
            // http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
            // http://bonsaiden.github.io/JavaScript-Garden/#types.typeof
            // Caution: returns "Object" for all user-defined types

            return Object.prototype.toString.call(obj).slice(8, -1);
        }
        private static is(typeName: string, obj: Object): boolean { return Helpers.getClass(obj) === typeName; }
    }
    export class JsTypes {
        static jsArray = "Array";
        static jsBoolean = "Boolean";
        static jsDate = "Date";
        static jsFunction = "Function";
        static jsNull = "Null";
        static jsNumber = "Number";
        static jsObject = "Object";
        static jsRegExp = "RegExp";
        static jsString = "String";
        static jsUndefined = "Undefined";
    }
}

var nums = [1, 2, 3, 4, 5, 6, 7];
var it = new ktw.Iterator(nums, (e) => { throw (e); });
it.enumerateAsync();