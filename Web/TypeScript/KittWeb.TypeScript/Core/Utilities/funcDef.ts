///<reference path="_references.ts" /> 

module KittWeb {
    export class JsTypes {
        public static JsBoolean = "boolean";
        public static JsFunction = "function";
        public static JsNumber = "number";
        public static JsObject = "object";
        public static JsString = "string";
        public static JsUndefined = "undefined";
    }

    export class FuncDef {
        // Helpers
        public static truthyCall(predicateFunc: Function, func: Function) {
            if (predicateFunc()) { // function only executes if predicate evaluates to true
                func();
            }
        }
        public static truthyFluid<T>(predicateFunc: Function, obj: T): T {
            if (predicateFunc()) {
                return obj; // return obj if predicate evaluates to true
            }

            return null; // return null if predicate evaluates to false
        }   
        public static truthyMulti(predicates: Array<() => boolean>) {
            var result = predicates[0](); // get first eval result

            if (result && predicates.length > 1) { // exit early if false or end of array 
                for (var i: number = 1; i < predicates.length; i++) { // remaining predicates 
                    result = (result && predicates[i]()); // perform logical OR

                    if (!result) { return result; } // exit early if false
                }
            }

            return result;
        }     

        // Array Related
        public static contains<T>(arr: T[], value: T): boolean {
            for (var i: number = 0; i < arr.length; i++) {
                if (arr[i] === value) {
                    return true;
                }

                return false;
            }
        }
        public static createArray<T>(length: number, defaultValue: any): T[] {
            var result = new Array<T>(length);

            for (var i: number = 0; i < length; i++) {
                result[i] = defaultValue;
            }

            return result;
        }

        // Object Related
        public static isFunction(obj: any): boolean {
            return (typeof obj) === JsTypes.JsFunction; // return true if obj is a function
        }
        public static isFunctionFluid<T>(obj: T): T {
            return this.truthyFluid(() => { return this.isFunction(obj); }, obj);
        }
        public static isNull(obj: any): boolean {
            return obj === null; // return true if obj is null
        }
        public static isNullFluid<T>(obj: T): T {
            return this.truthyFluid(() => { return this.isNull(obj); }, obj);
        }
        public static isNullOrUndefined(obj: any): boolean {
            return this.isNull(obj) || this.isUndefined(obj); // return true if obj is not null or undefined
        }
        public static isNullOrUndefinedFluid<T>(obj: T): T {
            return this.truthyFluid(() => { return this.isNullOrUndefined(obj); }, obj);
        }
        public static isUndefined(obj: any): boolean {
            return typeof (obj) === JsTypes.JsUndefined; // return true if obj is undefined
        }
        public static isUndefinedFluid<T>(obj: T): T {
            return this.truthyFluid(() => { return this.isUndefined(obj); }, obj);
        }
    }
}