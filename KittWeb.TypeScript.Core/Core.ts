module KittWeb.TypeScript.Core {
    // Helpers
    export class JsTypes {
        constructor(public value: string) {
        }

        toString() {
            return this.value;
        }

        static JsBoolean = "boolean";
        static JsFunction = "function";
        static JsNumber = "number";
        static JsObject = "object";
        static JsString = "string";
        static JsUndefined = "undefined";
    }
    export enum HashMethodType {
        "Bernstein",
        "Java",
        "Sbdm"
    }

    // Classes
    export class Exception implements Error {
        public message: string;
        public name: string;

        constructor(name?: string, message?: string) {
            if (message) { this.message = message; }
            if (name) { this.name = name; }
        }
    }
    export class NotImplementedException extends Exception {
        constructor(message?: string) {
            super("NotImplementedException", message || "Too lazy right now, might do it later.");
        }
    }

    // Contracts
    export interface ICompareFunc<T> {
        (a: T, b: T): number;
    }
    export interface IConvertFunc<T, TResult> {
        (a: T): TResult;
    }
    export interface IContainsFunc<T> {
        (a: T): boolean;
    }
    //export interface IDictionary<K, V> {
    //    count: number;
    //    keys: ICollection<K>;
    //    values: ICollection<V>;
    //    clear();
    //    contains(item: IKeyValuePair<K, V>): boolean;
    //    copyTo(array: IKeyValuePair<K, V>[], arrayIndex: number);
    //    containsKey(key: K): boolean;
    //    add(key: K, value: V);
    //    remove(key: K): boolean;
    //    getValue(key: K);
    //}
    export interface IEqualsFunc<T> {
        (a: T, b: T): boolean;
    }
    export interface IException {
        message: string;
        name: string;
    }
    export interface IList<T> {
        count: number;
        isReadOnly: boolean;
        add(item: T);
        clear();
        contains(item: T): boolean;
        copyTo(array: T[], arrayIndex: number);
        indexOf(item: T);
        insert(index: number): boolean;
        remove(item: T): boolean;
        removeAt(item: T);
    }
    export interface INumberFunc<T> {
        (a: T): number;
    }
    export interface ILoopFunc<T> {
        (a: T): boolean;
    }
    export interface IKeyValuePair<K, V> {
        key: K;
        value: V;
    }
    export interface IStringFunc<T> {
        (a: T): string;
    }

    export class DictionaryTest<K, V> {
        private m_table: { [key: string]: IKeyValuePair<K, V> }; // [key: K] does not work since indices can only by strings

        public count: number;
        public toStringFunc: IConvertFunc<K, string>;

        constructor(convertFunc?: IConvertFunc<K, string>) {
            this.m_table = {};
            this.count = 0;
            this.toStringFunc = convertFunc || this.convertKeyToString;
        }

        clear() {
            this.m_table = {};
            this.count = 0;
        }
        add(key: K, value: V) {
            if (Core.isUndefined(key) || Core.isUndefined(value)) {
                return undefined;
            }

            var k:string = this.toStringFunc(key);
            var prevKvp: IKeyValuePair<K, V> = this.m_table[k];

            if (Core.isUndefined(prevKvp)) {
                this.count++;
            } else {
            }

            this.m_table[k] = {
                key: key,
                value: value
            };
        }
        remove(key: K): V {
            var keyString = this.toStringFunc(key);
            var prevKvp: IKeyValuePair<K, V> = this.m_table[keyString];

            if (!Core.isUndefined(prevKvp)) {
                delete this.m_table[keyString];
                this.count--;
                return prevKvp.value;
            }

            return undefined;
        }

        private convertKeyToString(key: K): string {
            return (<Object>key).toString();
        }
    }

    export function containsKey<K>(key: K, containsFunc?: Core.IContainsFunc<K>): boolean {
        // Default
        if (!containsFunc) {return !Core.isUndefined(this.getValue(key)); }

        // User Supplied
        if (typeof (containsFunc) === JsTypes.JsFunction) { return containsFunc(key); }
    }
    export function getHashCode(obj: string, hashTypeOrStringFunc?: Core.INumberFunc<string>): number {
        // Default
        if (!hashTypeOrStringFunc) { return hashBernstein(obj); } 

        // User Supplied
        if (typeof (hashTypeOrStringFunc) === JsTypes.JsFunction) { return hashTypeOrStringFunc(obj); }

        // HasMethodType
        if ((<number><any>hashTypeOrStringFunc) === Core.HashMethodType.Bernstein) { return hashBernstein(obj); }
        if ((<number><any>hashTypeOrStringFunc) === Core.HashMethodType.Java) { return hashJava(obj); }
        if ((<number><any>hashTypeOrStringFunc) === Core.HashMethodType.Sbdm) { return hashSbdm(obj); }
    }
    export function hashBernstein(str: string): number { // Source: <http://erlycoder.com/49/javascript-hash-functions-to-convert-string-into-integer-hash->
        var cc: number;
        var hash: number = 5381;
        var i: number = 0;

        for (i; i < str.length; i++) {
            cc = str.charCodeAt(i);
            hash = ((hash << 5) + hash) + cc; /* hash * 33 + c */
        }

        return hash;
    }
    export function hashJava(str: string): number { // Source: <http://stackoverflow.com/a/7616484>
        var chr: number;
        var hash: number = 0;
        var i: number = 0;
        var len: number;

        if (str.length == 0) { return hash; }

        for (i, len = str.length; i < len; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }

        return hash;
    }
    export function hashSbdm(str: string): number { // Source: <http://erlycoder.com/49/javascript-hash-functions-to-convert-string-into-integer-hash->
        var chr: number;
        var hash: number = 0;
        var i: number = 0;

        for (i; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = chr + (hash << 6) + (hash << 16) - hash;
        }

        return hash;
    }
    export function isFunction(obj: any): boolean {
        return (typeof obj) === JsTypes.JsFunction;
    }
    export function isString(obj: any): boolean {
        return Object.prototype.toString.call(obj) === "[object String]";
    }
    export function isUndefined(obj: any): boolean {
        return (typeof obj) === Core.JsTypes.JsUndefined;
    }
}