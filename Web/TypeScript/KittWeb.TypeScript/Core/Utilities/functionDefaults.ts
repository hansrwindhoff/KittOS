///<reference path='../references.ts' /> 

module KittWeb {
    export class FunctionDefaults {
        // Array Related
        public static contains<T>(array: T[], value: T): boolean {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === value) {
                    return true;
                }

                return false;
            }
        }

        // Function Related
        public static callFunction(func: IFuncAny, predicateFunc?: IBooleanFuncAny) {
            if (predicateFunc()) {
                func();
            }
        }

        // Helpers
        public static Test1 {
        }

        // Object Related
        public static isFunction<T>(obj: T, shouldThrow: boolean = false): boolean {
            return (typeof obj) === JsTypes.JsFunction; // return true if obj is a function
        }
        public static isFunctionFluid<T>(obj: T): T {
            if (!this.isFunction(obj)) {
                return obj; // return T if obj is a function
            }

            return null; // return null if obj not a function
        }
        public static isNull<T>(obj: T): boolean {
            return obj === null; // return true if obj is null
        }
        public static isNullFluid<T>(obj: T): T {
            if (!this.isNull(obj)) {
                return obj; // return T if obj is not null
            }

            return null; // return null if obj is null
        }
        public static isNullOrUndefined<T>(obj: T): boolean {
            return this.isNull(obj) || this.isUndefined(obj); // return true if obj is not null or undefined
        }
        public static isNullOrUndefinedFluid<T>(obj: T): T {
            if (!this.isNullOrUndefined(obj)) {
                return obj; // return T is obj is not null or undefined
            }

            return null; // return null if obj is not null or undefined
        }
        public static isUndefined<T>(obj: T): boolean {
            return typeof (obj) === JsTypes.JsUndefined; // return true if obj is undefined
        }
        public static isUndefinedFluid<T>(obj: T): T {
            if (!this.isUndefined(obj)) {
                return obj; // return T if obj is defined
            }

            return null; // return null if obj is undefined
        }        
    }
}

console.log("Init");
var f = new KittWeb.FunctionDefaults();

KittWeb.FunctionDefaults.callFunction(() => { console.log("HI"); }, () => { return 1 === 2; });