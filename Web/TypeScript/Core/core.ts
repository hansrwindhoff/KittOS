﻿module kcl {
    "use strict";

    export enum DeferredStatus {
        Pending = 0,
        Completed = 1,
        Failed = 2,
    }
    export interface IDeferred<T> {
        handler: number;
        status: DeferredStatus;
        value: T;
    }
    export interface IIterator<T> {
        hasNext: boolean;
        length: number;
        next(): T;
    }
    export interface IAsyncIterator<T> extends IIterator<T> { nextAsync(): IDeferred<T>; }
    export interface IMapper<TInput, TResult> { (input: TInput): TResult; }
    export interface IPredicate { (...args: any[]): boolean; }
    export interface IReducer<TInput, TResult> { (previous: TResult, next: TInput): TResult; }

    export class Iterator<T> implements IAsyncIterator<T> {
        private m_collection: Array<T> = [];
        private m_failureCallback: Function;
        private m_position: number = 0;

        get hasNext(): boolean { return this.m_position < this.m_collection.length; }
        get length(): number { return this.m_collection.length; }

        enumerate(): void { while (this.hasNext) { this.next(); } }
        enumerateAsync(failure?: Function, breatherMs?: number): IDeferred<any> {
            return Helpers.repeat(() => {
                return this.next();
            }, failure, null, this.m_collection.length);
        }
        next(): T {
            if (this.hasNext) {
                var current: T = this.m_collection[this.m_position];

                this.m_position++;

                return current;
            }
        }
        nextAsync(): IDeferred<T> {
            return Helpers.defer<T>(() => {
                return this.next();
            }, this.m_failureCallback);
        }

        constructor(collection: Array<T>, failureCallback?: Function) {
            this.m_collection = collection;
            this.m_failureCallback = failureCallback;
        }
    }

    export class Helpers {
        static defer<T>(success?: Function, failure?: Function, durationMs: number = 0): IDeferred<T> {
            var result: IDeferred<T> = { // create new IDeferred<T>
                handler: undefined,
                status: DeferredStatus.Pending,
                value: undefined
            };

            result.handler = setTimeout(() => { // set handler
                try {
                    result.value = Helpers.nullApply((success || Helpers.noOp)); // fulfill
                    result.status = DeferredStatus.Completed; // mark as completed
                } catch (e) {
                    result.value = Helpers.nullApply((failure || Helpers.noOp)); // reject
                    result.status = DeferredStatus.Failed; // mark as failed
                }
            }, durationMs);

            return result;
        }
        static filter<T>(predicate: IPredicate, iterator: IIterator<T>): Iterator<T> {
            var filtered: Array<T> = [];

            while (iterator.hasNext) {
                var value = iterator.next();

                if (Helpers.nullApply(predicate, value)) {
                    filtered.push(value);
                }
            }

            return new Iterator(filtered);
        }
        static limit(func: Function, maxExecutions: number = 1) {
            var numExecutions: number = 0;

            return (...args: any[]) => {
                if (numExecutions < maxExecutions) {
                    numExecutions++;
                    return Helpers.nullApply(func, args);
                }
            }
        }
        static map<TInput, TResult>(mapper: IMapper<TInput, TResult>, iterator: IIterator<TInput>): Array<TResult> {
            var mapped: Array<TResult> = [];

            while (iterator.hasNext) { mapped.push(Helpers.nullApply(mapper, iterator.next())); }

            return mapped;
        }
        static mapAsync<TInput, TResult>(mapper: IMapper<TInput, TResult>, iterator: IIterator<TInput>, failure?: Function): any {
            return Helpers.repeat<TResult>(() => {
                return Helpers.nullApply(mapper, iterator.next());
            }, failure, null, iterator.length);
        }

        static noOp(): void { }
        static nullApply(func: Function, ...args: any[]): any { return func.apply(null, args); }
        static partial(func: Function, ...args: any[]) {
            return (...calledArgs: any[]) => {
                return Helpers.nullApply(func, args.concat(calledArgs));
            }
        }
        static reduce<TInput, TResult>(reducer: IReducer<TInput, TResult>, iterator: IIterator<TInput>, seedValue?: TResult): TResult {
            var accumulator: TResult = seedValue;

            while (iterator.hasNext) { accumulator = Helpers.nullApply(reducer, accumulator, iterator.next()); }

            return accumulator;
        }
        static repeat<T>(success?: Function, failure?: Function, intervalMs?: number, maxExecutions?: number): IDeferred<Array<T>> {
            var numExecutions: number = 0;
            var result: IDeferred<Array<T>> = { // create new IDeferred<Arr>
                handler: undefined,
                status: DeferredStatus.Pending,
                value: []
            };

            intervalMs = intervalMs || 15; // default intervalMs to 15ms

            var worker = () => {
                var start: number = Date.now();
                result.handler = setTimeout(worker, intervalMs); // prepare another worker

                do {
                    try {
                        numExecutions++;
                        result.value.push(Helpers.nullApply((success || Helpers.noOp))); // fulfill
                    } catch (e) {
                        result.value.push(Helpers.nullApply((failure || Helpers.noOp))); // reject
                        result.status = DeferredStatus.Failed; // mark as failed
                    }
                }
                while ((Date.now() - start < intervalMs) && numExecutions < maxExecutions);

                if (numExecutions === maxExecutions) {
                    clearTimeout(result.handler); // stop loop
                    result.status = DeferredStatus.Completed; // mark as complete
                }
            }

            result.handler = setTimeout(worker, 0); // start loop

            return result;
        }
        static wrap<T>(obj: T): Function { return (): T => { return obj; } }

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
        private static is<T>(typeName: string, obj: T): boolean { return Helpers.getClass(obj) === typeName; }
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

var nums = [1, 2, 3, 4, 5];
var mapped = kcl.Helpers.map((n: number) => { return n * n; }, new kcl.Iterator(nums));
var aMapped = kcl.Helpers.mapAsync((n: number) => { return n * n * n; }, new kcl.Iterator(nums));

console.log(mapped); // prints [1, 4, 9, 16, 25]
console.log(aMapped); // prints imcomplete deferred with empty array

setTimeout(() => {
    console.log(aMapped); // prints deferred with array [1, 8, 27, 64, 125]
}, 1000);