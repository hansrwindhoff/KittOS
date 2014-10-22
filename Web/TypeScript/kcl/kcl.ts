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
    export class Repeater {
        private m_deferred: IDeferred<any>;

        start(success?: Function, failure?: Function, delayMs?: number, maxExecutions?: number): IDeferred<any> {
            var deferred = Helpers.repeat<any>(success, failure, delayMs, maxExecutions);

            this.m_deferred = deferred;

            return deferred;
        }
        stop(): IDeferred<any> {
            this.m_deferred.status = DeferredStatus.Completed;

            return this.m_deferred;
        }
    }

    export class Helpers {
        static defer<T>(success?: Function, failure?: Function, delayMs: number = 0): IDeferred<T> {
            var result: IDeferred<T> = {
                handler: undefined,
                status: DeferredStatus.Pending,
                value: undefined
            };

            result.handler = setTimeout(() => { // spawn worker and assign handler
                try {
                    result.value = Helpers.nullApply((success || Helpers.noOp)); // fulfill
                    result.status = DeferredStatus.Completed; // mark as completed
                } catch (e) {
                    result.value = Helpers.nullApply((failure || Helpers.noOp), [e]); // reject
                    result.status = DeferredStatus.Failed; // mark as failed
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
        static repeat<T>(success?: Function, failure?: Function, delayMs?: number, maxExecutions?: number): IDeferred<T> {
            delayMs = ((kcl.Helpers.isNumber(delayMs) && delayMs > 4) ? delayMs : 4) // set delayMs to 4 if not number or < 4 (see: https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/Hn3GxRLXmR0)
            var numExecutions: number = 0;
            var result: IDeferred<T> = {
                handler: undefined, // handler of the next looper
                status: DeferredStatus.Pending,
                value: undefined
            };
            
            var looper = () => {
                var start: number = Date.now();
                result.handler = setTimeout(looper, delayMs); // spawn next looper

                do { // start loop
                    try {
                        numExecutions++;
                        result.value = Helpers.nullApply((success || Helpers.noOp)); // fulfill
                    } catch (e) {
                        result.value = Helpers.nullApply((failure || Helpers.noOp), [e]); // reject
                        result.status = DeferredStatus.Failed; // mark as failed
                    } finally {
                        if (numExecutions === maxExecutions) { // maxExecutions reached
                            result.status = DeferredStatus.Completed; // mark as complete
                        }

                        if (result.status !== DeferredStatus.Pending) { // fulfilled or rejected
                            clearTimeout(result.handler); // cancel next looper
                            break; // break from loop
                        }
                    }
                }
                while (((Date.now() - start) < delayMs)); // break from loop after delayMs reached
            }

            result.handler = setTimeout(looper, 0); // start first looper

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

var i = 0;
var counter = new kcl.Repeater();
counter.start(() => {
    i++;

    if (i === 100) {
        counter.stop();
        console.log(i);
    }
}, null);

console.log("Hello world!");