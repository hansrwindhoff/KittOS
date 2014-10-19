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

    export interface IIterator {
        hasNext: boolean;
        next(): any;
    }
    export interface IMapper<TInput, TResult> { (input: TInput): TResult; }
    export interface IPredicate { (...args: any[]): boolean; }
    export interface IReducer<TResult> { (left: any, right: any): TResult; }
    export interface IWrapper<TInput> { (): TInput; }

    export class Iterator implements IIterator {
        private m_collection: Array<any>;
        private m_position: number = 0;

        get hasNext(): boolean {
            return this.m_position < this.m_collection.length;
        }
        enumerate(): void {
            while (this.hasNext) { this.next(); }
        }
        next(): any {
            if (this.hasNext) {
                var current = this.m_collection[this.m_position];

                this.m_position++;

                return current;
            }
        }

        constructor(collection: Array<any>) {
            this.m_collection = collection;
        }
    }
    export class FilterIterator<T> extends Iterator {
        private m_predicate: IPredicate;

        constructor(collection: Array<T>, predicate: IPredicate) {
            super(collection);
            this.m_predicate = predicate;
        }

        next(): T {
            var current: T = super.next();

            if (this.m_predicate(current)) {
                return current;
            } else {
                while (!this.m_predicate(current) && this.hasNext) {
                    current = super.next();

                    if (this.m_predicate(current)) {
                        return current;
                    }
                }
            }
        }
    }
    export class MapIterator<T, U> extends Iterator {
        private m_mapper: IMapper<T, U>;

        constructor(collection: Array<T>, mapper: IMapper<T, U>) {
            super(collection);
            this.m_mapper = mapper;
        }

        next(): U {
            return this.m_mapper(super.next());
        }
    }
    export class ReduceIterator<T> extends Iterator {
        private m_previous: T;
        private m_reducer: IReducer<T>;

        constructor(collection: Array<any>, reducer: IReducer<T>, seed: any = null) {
            super(collection);
            this.m_reducer = reducer;
            this.m_previous = seed;
        }

        next(): T {
            var current: T = this.m_reducer(this.m_previous, super.next());

            this.m_previous = current;

            return current;
        }
    }

    export class Helpers {
        static generateUuid() {
            // http://stackoverflow.com/a/8809472/1186165

            var ms: number = new Date().getTime();

            var uuid: string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r: number = (ms + Math.random() * 16) % 16 | 0;
                ms = Math.floor(ms / 16);
                return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });

            return uuid;
        }
        static hashFnv1a(str: string, offset: number = 2166136261): number {
            // https://gist.github.com/vaiorabbit/5657561
            // http://isthe.com/chongo/tech/comp/fnv/

            var hash = offset;
            var i: number, l: number;

            for (i = 0, l = str.length; i < l; i++) {
                hash ^= str.charCodeAt(i);
                hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
            }

            return hash >>> 0;
        }

        static isArray(obj: Object): boolean {
            return Helpers.is(JsTypes.jsArray, obj);
        }
        static isFunction(obj: Object): boolean {
            return Helpers.is(JsTypes.jsFunction, obj);
        }
        static isNumber(str: string): boolean;
        static isNumber(num: number): boolean;
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

        static debounce(func: Function, thresholdMs?: number): Function {
            var timeoutHandler: number;

            return (...args) => {
                var delayed = () => {
                    timeoutHandler = null;
                    func.apply(null, args);
                };

                if (timeoutHandler) { clearTimeout(timeoutHandler); }
                else { func.apply(null, args); }

                timeoutHandler = Helpers.delay(thresholdMs, delayed);
            };
        }
        static delay(durationMs: number, func: Function): number;
        static delay(durationMs: number, func: Function, ...funcArgs): number;
        static delay(durationMs: number = 100, func?: Function, ...funcArgs): number {
            if (!funcArgs) {
                return setTimeout(func, durationMs);
            } else {
                return setTimeout(() => { func.apply(null, funcArgs); }, durationMs);
            }
        }
        static noOp(): void { }
        static partial(func: Function, ...funcArgs) {
            return (...args) => {
                return func.apply(null, funcArgs.concat(args));
            }
        }
        static pipeline(...funcs) {
            return (...funcArgs) => {
                var pipelineFunc = new ReduceIterator(funcs, (args: IArguments, func: Function) => {
                    return [func.apply(null, args)];
                }, funcArgs);

                var result;

                while (pipelineFunc.hasNext) { result = pipelineFunc.next(); }

                return result[0];
            }
        }

        static add: IReducer<number> = (n1, n2) => { return n1 + n2; };
        static subtract: IReducer<number> = (n1, n2) => { return n1 - n2; };
        static multiply: IReducer<number> = (n1, n2) => { return n1 * n2; };
        static divide: IReducer<number> = (n1, n2) => { return n1 / n2; };
        static remainder: IReducer<number> = (n1, n2) => { return n1 % n2; };
        static min: IReducer<number> = (n1, n2) => { return Math.min(n1, n2); };
        static max: IReducer<number> = (n1, n2) => { return Math.max(n1, n2); };
        static lessThan: IPredicate = (l: any, r: any) => { return l < r; };
        static greaterThan: IPredicate = (l: any, r: any) => { return l > r; };
        static equalTo: IPredicate = (l: any, r: any) => { return l === r; };

        private static getClass(obj: Object): string {
            // http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
            // http://bonsaiden.github.io/JavaScript-Garden/#types.typeof
            // Caution: returns "Object" for all user-defined types

            return Object.prototype.toString.call(obj).slice(8, -1);
        }
        private static is(typeName: string, obj: Object): boolean {
            return Helpers.getClass(obj) === typeName;
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

var partialed = ktw.Helpers.partial(ktw.Helpers.add, 20); // (n:number) => { return add(20, n); }
var pipelined = ktw.Helpers.pipeline( // executes partialed, executes console.log with the result of partialed
    partialed
  , console.log.bind(console)
); 
var delayed = ktw.Helpers.delay(2000, pipelined, 80); // calls pipelined(80) after 2000ms