///<reference path='../references.ts' />

module KittWeb {
    export class ObjectUtilities {
        public static isFunction<T>(obj: T, isFunctionFunc?: IBooleanFunc<T>): boolean {
            if (this.isNullOrUndefined) {
                return FunctionDefaults.isFunction(obj);
            }

            return isFunctionFunc(obj);
        }
        public static isNullOrUndefined<T>(obj: T, isNullOrUndefinedFunc?: IBooleanFunc<T>) {
            // Check if custom function was provided
            if (FunctionDefaults.isNullOrUndefined(isNullOrUndefinedFunc)) {
                return FunctionDefaults.isNullOrUndefined(obj); // Return default implementation
            }

            return isNullOrUndefinedFunc(obj); // return custom implementation
        }
        public static isNullOrUndefinedFluid<T>(obj: T, isNullOrUndefinedFluidFunc?: IFluidFunc<T>): T {
            // Check if custom function was provided
            if (FunctionDefaults.isNullOrUndefined(isNullOrUndefinedFluidFunc)) {
                return FunctionDefaults.isNullOrUndefinedFluid(obj); // Return default implementation
            }

            return isNullOrUndefinedFluidFunc(obj); // return custom implementation
        }
    }
} 