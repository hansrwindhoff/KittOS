module ktw {
    export interface IPredicate { (...any): boolean; }

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
        static hasFlag(value: number, flag: number): boolean {
            return (value & flag) != 0;
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
            return (args: IArguments) => { return !predicate(args); }
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
            .map((item) => { return projectFunc(item); })
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

var a = [1, 2, 3];
var b = ["one", "two", "three"];

var cubed = a.map((a) => {
    return a * a * a;
});
var squared = a.map((a) => {
    return a * a;
});
var flattened = [a, b].flatten();
var zipped = a.zip(b, (a, b) => { return { number: a, string: b }; });

var wrap = (value) => {
    return value;
};

console.log(JSON.stringify(cubed));
console.log(JSON.stringify(squared));
console.log(JSON.stringify(flattened));
console.log(JSON.stringify(zipped));