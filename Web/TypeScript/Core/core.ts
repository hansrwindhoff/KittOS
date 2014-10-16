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
    export interface IComparer<T> { (left: T, right: T): number; }
    export interface IIterator<T> {
        hasNext(): boolean;
        next(): T;
    }
    export interface IPredicate { (...any): boolean; }
    export interface IWrapper<T> { (): T; }

    export class Iterator<T> implements IIterator<T> {
        private m_collection: Array<T>;
        private m_position: number = 0;

        hasNext() {
            return this.m_position < this.m_collection.length;
        }
        next() {
            var result: T;

            if (this.hasNext) {
                result = this.m_collection[this.m_position];
                this.m_position++;
            }

            return result;
        }

        constructor(collection: Array<T>) {
            this.m_collection = collection;
        }
    }
    export class FilterIterator<T> extends Iterator<T> {
        private m_predicate: IPredicate;

        constructor(collection: Array<T>, predicate: IPredicate) {
            super(collection);
            this.m_predicate = predicate;
        }

        next() {
            while (this.hasNext()) {
                var result = super.next();

                if (this.m_predicate(result)) {
                    return result;
                }
            }
        }
    }
    export class MapIterator<T> extends Iterator<T> {
        private m_func: Function;

        constructor(collection: Array<T>, func: Function) {
            super(collection);
            this.m_func = func;
        }

        next() {
            while (this.hasNext()) {
                return this.m_func(super.next());
            }
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
    export class Utilities {
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
            return Utilities.is(JsTypes.jsArray, obj);
        }
        static isFunction(obj: Object): boolean {
            return Utilities.is(JsTypes.jsFunction, obj);
        }
        static isNumber(str: string): boolean;
        static isNumber(num: number): boolean;
        static isNumber(obj: any): boolean {
            if (Utilities.is(JsTypes.jsNumber, obj)) { return true; } // num overload
            if (Utilities.is(JsTypes.jsString, obj)) { return !isNaN(obj); } // str overload

            return false;
        }
        static isNull(obj: Object): boolean {
            return Utilities.is(JsTypes.jsNull, obj);
        }
        static isNullOrUndefined(obj: Object): boolean {
            return Utilities.isNull(obj) || Utilities.isUndefined(obj);
        }
        static isString(obj: Object): boolean {
            return Utilities.is(JsTypes.jsString, obj);
        }
        static isUndefined(obj: Object): boolean {
            return Utilities.is(JsTypes.jsUndefined, obj);
        }
        static noOp(): void { }
        static not(predicate: IPredicate): IPredicate {
            return (args: IArguments) => { return !predicate(args); };
        }
        static wrap<T>(value: T): IWrapper<T> {
            return () => { return value; };
        }

        private static getClass(obj: Object): string {
            // http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
            // http://bonsaiden.github.io/JavaScript-Garden/#types.typeof
            // Caution: returns "Object" for all user-defined types

            return Object.prototype.toString.call(obj).slice(8, -1);
        }
        private static is(typeName: string, obj: Object): boolean {
            return Utilities.getClass(obj) === typeName;
        }
    }
}

var numbers = [1, 2, 3, 4, 5];
var cube = (num) => { return num * num * num; };
var ltFourFilter = (item) => { return item < 4; };

var cubedNumbers = new ktw.MapIterator(numbers, cube);

console.log(cubedNumbers.next()); // 1
console.log(cubedNumbers.next()); // 8
console.log(cubedNumbers.next()); // 27
console.log(cubedNumbers.next()); // 64
console.log(cubedNumbers.next()); // 100
console.log(cubedNumbers.next()); // undefined

var ltFourNumbers = new ktw.FilterIterator(numbers, ltFourFilter);
console.log(ltFourNumbers.next()); // 1
console.log(ltFourNumbers.next()); // 2
console.log(ltFourNumbers.next()); // 3
console.log(ltFourNumbers.next()); // undefined