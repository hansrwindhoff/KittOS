module kcl {
    "use strict";

    export enum DeferredStatus {
        Pending = 0,
        Completed = 1,
        Failed = 2,
    }
    export interface IDeferred<T> {
        status: DeferredStatus;
        value: T;
    }
    export interface IIterator<T> {
        hasNext: boolean;
        next(): T;
    }
    export interface IAsyncIterator<T> extends IIterator<T> { nextAsync(): IDeferred<T>; }
    export interface IMapper<TInput, TResult> { (input: TInput): TResult; }
    export interface IObservable<T> { value: T; }
    export interface IPredicate { (...args: any[]): boolean; }
    export interface IReducer<TInput, TResult> { (previous: TResult, next: TInput): TResult; }

    export class Iterator<T> implements IAsyncIterator<T> {
        private m_collection: Array<T>;
        private m_position: number = 0;

        get hasNext(): boolean { return this.m_position < this.m_collection.length; }

        next(): T {
            if (this.hasNext) {
                var current: T = this.m_collection[this.m_position];

                this.m_position++;

                return current;
            }
        }
        nextAsync(failure?: Function): IDeferred<T> {
            return Helpers.defer<T>(() => { return this.next(); }, failure);
        }

        constructor(collection: Array<T> = []) { this.m_collection = collection; }
    }

    export class Helpers {
        static defer<T>(success?: Function, failure?: Function, delayMs: number = 0): IDeferred<T> {
            var result = {
                status: DeferredStatus.Pending,
                value: undefined
            };

            setTimeout(() => { // start delay
                if (result.status === DeferredStatus.Pending) { // defer wasn't cancelled
                    try {
                        result.value = Helpers.nullApply((success || Helpers.noOp)); // call success or no-op
                        result.status = DeferredStatus.Completed; // fulfill
                    } catch (e) {
                        result.value = Helpers.nullApply((failure || Helpers.noOp), e); // call failure or no-op
                        result.status = DeferredStatus.Failed; // reject
                    }
                }
            }, delayMs);

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
        static limit(func: Function, maxExecutions: number = 1): Function {
            var numExecutions: number = 0;

            return (...args: any[]) => {
                if (numExecutions < maxExecutions) {
                    numExecutions++;
                    return Helpers.nullApply(func, args);
                }
            }
        }
        static loop<T>(success?: Function, failure?: Function, delayMs: number = 4): IDeferred<T> { // Why default delayMs of 4? See: https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/Hn3GxRLXmR0.            
            var result: IDeferred<T> = {
                status: DeferredStatus.Pending,
                value: undefined
            };

            var looper = () => {
                var next = setTimeout(looper, delayMs); // spawn next looper

                if (result.status !== DeferredStatus.Pending) { // fulfilled or rejected
                    clearTimeout(next); // cancel next looper
                } else {
                    try {
                        result.value = Helpers.nullApply((success || Helpers.noOp)); // call success or no-op
                    } catch (e) {
                        result.status = DeferredStatus.Failed; // reject
                        result.value = Helpers.nullApply((failure || Helpers.noOp), e); // call failure no-op
                    }
                }
            }

            setTimeout(looper, delayMs); // start first looper

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
            }
        }
        static reduce<TInput, TResult>(reducer: IReducer<TInput, TResult>, iterator: IIterator<TInput>, seedValue?: TResult): TResult {
            var accumulator: TResult = seedValue;

            while (iterator.hasNext) { accumulator = Helpers.nullApply(reducer, accumulator, iterator.next()); }

            return accumulator;
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
        private static is<T>(type: JsTypes, obj: T): boolean { return Helpers.getClass(obj) === type; }
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