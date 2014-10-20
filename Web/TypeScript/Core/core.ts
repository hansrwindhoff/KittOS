module kcl {
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
        next(): T;
    }
    export interface IAsyncIterator<T> extends IIterator<T> { nextAsync(): IDeferred<T>; }
    export interface IMapper<TInput, TResult> { (input: TInput): TResult; }
    export interface IPredicate { (...args: any[]): boolean; }
    export interface IReducer<TInput, TResult> { (previous: TResult, next: TInput): TResult; }

    export class Iterator<T> implements IAsyncIterator<T> {
        private m_collection: Array<T> = [];
        private m_errorCallback: Function;
        private m_position: number = 0;

        get hasNext(): boolean { return this.m_position < this.m_collection.length; }

        enumerate(): void { while (this.hasNext) { this.next(); } }
        enumerateAsync(): IDeferred<any> {
            var breakIntervalMs: number = 15;
            var loop: IDeferred<any> = Helpers.repeat(() => {
                var start: number = +new Date();
                while (this.hasNext && ((+new Date() - start) < breakIntervalMs)) { this.next(); }

                if (!this.hasNext) {
                    clearInterval(loop.handler);
                    loop.status = DeferredStatus.Completed;
                }
            }, this.m_errorCallback, breakIntervalMs);

            return loop;
        }
        next(): T {
            if (this.hasNext) {
                var current: T = this.m_collection[this.m_position];

                this.m_position++;

                return current;
            }
        }
        nextAsync(): IDeferred<T> { return Helpers.defer<T>(() => { this.next(); }, this.m_errorCallback); }

        constructor(collection: Array<T>, errorCallback?: Function) {
            this.m_collection = collection;
            this.m_errorCallback = errorCallback;
        }
    }

    export class Helpers {
        static defer<T>(success?: Function, failure?: Function, durationMs: number = 0): IDeferred<T> {
            var result: IDeferred<T> = {
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
        static filter<T>(predicate: IPredicate, iterator: IIterator<T>): IIterator<T> {
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
        static map<TInput, TResult>(mapper: IMapper<TInput, TResult>, iterator: IIterator<TInput>): IIterator<TResult> {
            var mapped: Array<TResult> = [];

            while (iterator.hasNext) { mapped.push(Helpers.nullApply(mapper, iterator.next())); }

            return new Iterator(mapped);
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
        static repeat<T>(success?: Function, failure?: Function, intervalMs?: number, maxExecutions?: number): IDeferred<T> {
            var numExecutions: number = 0;
            var result: IDeferred<T> = {
                handler: undefined,
                status: DeferredStatus.Pending,
                value: undefined
            };

            result.handler = setInterval(() => {
                if ((numExecutions < maxExecutions) || !maxExecutions) {
                    try {
                        numExecutions++;
                        result.value = Helpers.nullApply((success || Helpers.noOp)); // fulfill
                    } catch (e) {
                        clearInterval(result.handler); // clear interval handler
                        result.value = Helpers.nullApply((failure || Helpers.noOp)); // reject
                        result.status = DeferredStatus.Failed; // mark as failed
                    }
                } else if (numExecutions === maxExecutions) { // max executions reached
                    clearInterval(result.handler); // clear interval handler
                    result.status = DeferredStatus.Completed; // mark as completed
                }
            }, intervalMs || 15);

            return result;
        }
        static wrap<T>(obj: T): Function { return (): T => { return obj; } }

        static isArray(obj: Object): boolean { return Helpers.is(JsTypes.jsArray, obj); }
        static isFunction(obj: Object): boolean { return Helpers.is(JsTypes.jsFunction, obj); }
        static isNumber(str: string): boolean;
        static isNumber(num: number): boolean;
        static isNumber(obj: Object): boolean;
        static isNumber(obj: any): boolean {
            if (Helpers.is(JsTypes.jsNumber, obj)) { return true; } // num overload
            if (Helpers.is(JsTypes.jsString, obj)) { return !isNaN(obj); } // str overload

            return false;
        }
        static isNull(obj: Object): boolean { return Helpers.is(JsTypes.jsNull, obj); }
        static isNullOrUndefined(obj: Object): boolean { return Helpers.isNull(obj) || Helpers.isUndefined(obj); }
        static isObject(obj: Object): boolean { return Helpers.is(JsTypes.jsObject, obj); }
        static isString(obj: Object): boolean { return Helpers.is(JsTypes.jsString, obj); }
        static isUndefined(obj: Object): boolean { return Helpers.is(JsTypes.jsUndefined, obj); }

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