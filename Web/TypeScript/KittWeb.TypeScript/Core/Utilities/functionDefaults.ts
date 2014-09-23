///<reference path='../references.ts' /> 

module TypeScript {
    export class FunctionDefaults {
        // arrayUtilities
        public static contains<T>(array: T[], value: T): boolean {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === value) {
                    return true;
                }
            }
        }

        // functionUtilities
        public static isFunction<T>(obj: T): boolean {
            return (typeof obj) === JsTypes.JsFunction;
        }
        public static isNullOrEmpty<T>(obj: T): boolean {
            if (obj) {
                return true;
            }

            return false;
        }
        public static isNullOrEmptyFluid<T>(obj: T): T {
            if (obj) {
                return obj;
            }

            return null;
        }
    }
}