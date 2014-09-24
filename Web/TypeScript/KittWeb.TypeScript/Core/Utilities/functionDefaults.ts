///<reference path='../references.ts' /> 

module KittWeb {
    export class FunctionDefaults {
        // Helpers
        public static evaluateFluid<T>(obj: T, predicateFunc: IBooleanFuncAny): T {
            if (predicateFunc()) {
                return obj; // return obj if predicate evaluates to true
            }

            return null; // return null if predicate evaluates to false
        }
        public static callFunction(func: IFuncAny, predicateFunc?: IBooleanFuncAny) {
            if (predicateFunc()) { // function only executes if predicate evaluates to true
                func();
            }
        }

        // Array Related
        public static contains<T>(array: T[], value: T): boolean {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === value) {
                    return true;
                }

                return false;
            }
        }

        // Object Related
        public static isFunction(obj: any): boolean {
            return (typeof obj) === JsTypes.JsFunction; // return true if obj is a function
        }
        public static isFunctionFluid<T>(obj: T): T {
            return this.evaluateFluid(obj, () => { return this.isFunction(obj); });
        }
        public static isNull(obj: any): boolean {
            return obj === null; // return true if obj is null
        }
        public static isNullFluid<T>(obj: T): T {
            return this.evaluateFluid(obj, () => { return this.isNull(obj); });
        }
        public static isNullOrUndefined(obj: any): boolean {
            return this.isNull(obj) || this.isUndefined(obj); // return true if obj is not null or undefined
        }
        public static isNullOrUndefinedFluid<T>(obj: T): T {
            return this.evaluateFluid(obj, () => { return this.isNullOrUndefined(obj); });
        }
        public static isUndefined(obj: any): boolean {
            return typeof (obj) === JsTypes.JsUndefined; // return true if obj is undefined
        }
        public static isUndefinedFluid<T>(obj: T): T {
            return this.evaluateFluid(obj, () => { return this.isUndefined(obj); });
        }        
    }
}