module kcl {
    "use strict";

    export enum DeferredStatus {
        Pending = 0,
        Completed = 1,
        Failed = 2,
    }
    export interface IAsyncIterator<T> extends IIterator<T> { nextAsync(): IDeferred<T>; }
    export interface IDeferred<T> {
        status: DeferredStatus;
        value: T;
    }
    export interface IIterator<T> {
        hasNext: boolean;
        next(): T;
        position: number;
    }
    export interface IMapper<TInput, TResult> { (input: TInput): TResult; }
    export interface IPredicate { (...args: any[]): boolean; }
    export interface IReducer<TInput, TResult> { (previous: TResult, next: TInput): TResult; }

    export class ArrayIterator<T> implements IAsyncIterator<T> {
        private m_collection: Array<T> = [];
        private m_position: number = 0;

        get hasNext(): boolean { return this.m_position < this.m_collection.length; }
        get position(): number { return this.m_position; }

        next(): T {
            if (this.hasNext) { // no-op if at end of array
                var current: T = this.m_collection[this.m_position];

                this.m_position++;

                return current;
            }
        }
        nextAsync(failure?: Function): IDeferred<T> {
            return Helpers.defer<T>(() => { return this.next(); }, failure);
        }

        constructor(collection?: Array<T>) { this.m_collection = collection; }
    }

    export class Helpers {
        static batch<T>(success?: Function, failure?: Function, delayMs?: number) {
            delayMs = Helpers.isNumber(delayMs) && delayMs > 4 ? delayMs : 4; // if delayMs is not number or < 4 then default to 4

            var aLoop = Helpers.loop<T>(() => { // start async loop
                var start: number = Date.now();

                while ((Date.now() - start) < delayMs) {
                    if (aLoop.status !== DeferredStatus.Pending) { // fulfilled or rejected 
                        break; // exit while loop
                    }

                    aLoop.value = Helpers.nullApply((success || Helpers.noOp)); // call success or no-op
                };

                return aLoop.value // return latest value
            }, failure, delayMs);

            return aLoop;
        }
        /// defer<T>: Function
        /// Params:
        ///     success: Function (optional) - called after the specified delay
        ///     failure: Function (optional) - called when an error is thrown
        ///     delayMs: Number (optional), default 4 - how long, in milliseconds, to delay execution
        /// 
        /// Description: Asynchronously delays function execution for a period of time. An IDeferred<T> is immediately
        ///              returned that will have a value of undefined. When the function executes the result will be stored
        ///              in the deferred's value property. Exceptions are caught and passed to the failure function and the
        ///              deferred is marked as failed.
        ///
        /// Usage: kcl.Helpers.defer(() => { console.log("Hello world!"); }, null, 1000); // prints "Hello world!" after 1 second
        ///        var d = kcl.Helpers.defer(() => { return 1; }, null, 1000); // stores the deferred in a variable d
        ///        console.log(d.value); // prints undefined
        ///        kcl.Helpers.defer(() => { console.log(d.value); }, null), 2000); // prints 1
        static defer<T>(success?: Function, failure?: Function, delayMs: number = 4): IDeferred<T> {
            var result = {
                status: DeferredStatus.Pending,
                value: undefined
            };

            setTimeout(() => { // begin defer
                if (result.status === DeferredStatus.Pending) { // defer wasn't cancelled
                    try {
                        result.value = Helpers.nullApply((success || Helpers.noOp)); // call success or no-op
                        result.status = DeferredStatus.Completed; // fulfill
                    } catch (e) {
                        result.value = Helpers.nullApply((failure || Helpers.wrap(e)), e); // call failure or return e
                        result.status = DeferredStatus.Failed; // reject
                    }
                }
            }, delayMs);

            return result;
        }
        static filter<T>(predicate: IPredicate, iterator: IIterator<T>): Array<T> {
            var filtered: Array<T> = [];

            while (iterator.hasNext) {
                var value = iterator.next();

                if (Helpers.nullApply(predicate, value)) {
                    filtered.push(value);
                }
            }

            return filtered;
        }
        static forEachAsync<T>(iterator: IIterator<T>, success: Function, failure?: Function, batchSizeMs?: number): IDeferred<number> {
            var aBatch = Helpers.batch<number>(() => { // start async batch
                if (iterator.hasNext) {
                    Helpers.nullApply(success, iterator.next()); // call success
                } else {
                    aBatch.status = DeferredStatus.Completed; // fulfill
                }

                return iterator.position;
            }, failure, batchSizeMs);

            return aBatch;
        }
        static limit(func: Function, maxExecutions: number = 1): Function {
            var numExecutions: number = 0;

            return (...args: any[]) => {
                if (numExecutions < maxExecutions) {
                    numExecutions++;
                    return Helpers.nullApply(func, args);
                }
            }
        }
        /// loop<T>: Function
        /// Params:
        ///    success: Function (optional) - called repeatedly after the specified delay
        ///    failure: Function (optional) - called when an error is thrown
        ///    delayMs: Number (optional), default 4 - how long, in milliseconds, to delay between loops
        ///
        /// Description: Asychronously executes a function repeatedly every X milliseconds (specified by deferMs). Like
        ///              defer<T> an IDeferred<T> is immediately returned that has a value of undefined. The result of the
        ///              success function is stored in the deferred's value property (overriding the previous value after 
        ///              every execution). Looping stops once the deferred's status property is marked as anything other
        ///              than pending.
        ///
        /// Usage: var i = 0;
        ///        var counter = kcl.Helpers.loop(() => {
        ///            i++;
        ///            if(i === 5) { counter.status = kcl.DeferredStatus.Completed; } // stops loop after i reaches 5
        ///            return i;
        ///        }, null, 1000); // call every 1 second
        ///        console.log(counter.value); // prints undefined
        ///        kcl.Helpers.defer(() => { console.log(counter.value); }, null, 6000); // prints 5
        static loop<T>(success?: Function, failure?: Function, delayMs: number = 4): IDeferred<T> {
            var result: IDeferred<T> = {
                status: DeferredStatus.Pending,
                value: undefined
            };

            var looper = () => {
                var next = setTimeout(looper, delayMs); // spawn next looper

                if (result.status !== DeferredStatus.Pending) { // fulfilled or rejected
                    clearTimeout(next); // kill next looper
                } else {
                    try {
                        result.value = Helpers.nullApply((success || Helpers.noOp)); // call success or no-op
                    } catch (e) {
                        result.status = DeferredStatus.Failed; // reject
                        result.value = Helpers.nullApply((failure || Helpers.wrap(e)), e); // call failure or return e
                    }
                }
            }

            setTimeout(looper, 0); // start first looper

            return result;
        }
        static map<TInput, TResult>(mapper: IMapper<TInput, TResult>, iterator: IIterator<TInput>): Array<TResult> {
            var mapped: Array<TResult> = [];

            while (iterator.hasNext) { mapped.push(Helpers.nullApply(mapper, iterator.next())); }

            return mapped;
        }
        static noOp(): void { }
        static nullApply(func: Function, ...args: any[]): any { return func.apply(null, args); }
        static partial(func: Function, ...args: any[]): Function {
            return (...calledArgs: any[]) => {
                return Helpers.nullApply(func, args.concat(calledArgs));
            };
        }
        /// pipeline: Function
        /// Params:
        ///     funcs: Array<Function> - an array of functions to be executed
        ///
        /// Description: Returns a new function that accepts a variable number of arguments. The arguments that are
        ///              supplied to the new function will be passed to the first function in funcs. Each function is
        ///              executed in the order supplied and the results are passed to the next function.
        ///
        /// Usage: var cube = (n:number) => { return n * n * n; };
        ///        var half = (n:number) => { return n / 2; };
        ///        var cubeHalfPrint = kcl.Helpers.pipeline(cube, half, console.log.bind(console));
        ///        cubeHalfPrint(2); // prints 4
        ///        cubeHalfPrint(3); // prints 13.5
        static pipeline(...funcs: Function[]) {
            return (...args: any[]) => {
                return Helpers.reduce((funcArgs: any, func: Function) => {
                    return Helpers.nullApply(func, funcArgs);
                }, new ArrayIterator(funcs), args);
            };
        }
        static reduce<TInput, TResult>(reducer: IReducer<TInput, TResult>, iterator: IIterator<TInput>, seedValue?: TResult): TResult {
            var accumulator: TResult = seedValue;

            while (iterator.hasNext) { accumulator = Helpers.nullApply(reducer, accumulator, iterator.next()); }

            return accumulator;
        }
        static wrap<T>(obj: T): Function { return (): T => { return obj; } }

        static is<T>(jsType: JsTypes, obj: T): boolean { return Helpers.getClass(obj) === jsType; }
        static isArray<T>(obj: T): boolean { return Helpers.is(JsTypes.jsArray, obj); }
        static isFunction<T>(obj: T): boolean { return Helpers.is(JsTypes.jsFunction, obj); }
        static isNumber(str: string): boolean;
        static isNumber(num: number): boolean;
        static isNumber<T>(obj: T): boolean;
        static isNumber(obj: any): boolean {
            if (Helpers.is(JsTypes.jsNumber, obj)) { return true; } // num overload
            if (Helpers.is(JsTypes.jsString, obj)) { return !isNaN(obj); } // str overload

            return false;
        }
        static isNull<T>(obj: T): boolean { return Helpers.is(JsTypes.jsNull, obj); }
        static isNullOrUndefined<T>(obj: T): boolean { return Helpers.isNull(obj) || Helpers.isUndefined(obj); }
        static isObject<T>(obj: T): boolean { return Helpers.is(JsTypes.jsObject, obj); }
        static isString<T>(obj: T): boolean { return Helpers.is(JsTypes.jsString, obj); }
        static isUndefined<T>(obj: T): boolean { return Helpers.is(JsTypes.jsUndefined, obj); }

        private static getClass<T>(obj: T): string {
            // http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
            // http://bonsaiden.github.io/JavaScript-Garden/#types.typeof
            // Caution: returns "Object" for all user-defined types

            return Object.prototype.toString.call(obj).slice(8, -1);
        }
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