///<reference path='../references.ts' />

module TypeScript {
    export class ObjectUtilities {
        public static isFunction<T>(obj: T, isFunctionFunc?: IBooleanFunc<T>): boolean {
            if (!isFunctionFunc) {
                return FunctionDefaults.isFunction(obj);
            }

            return isFunctionFunc(obj);
        }
        public static isNullOrEmpty<T>(obj: T, isNullOrEmptyFunc?: IBooleanFunc<T>) {
            if (!isNullOrEmptyFunc) {
                return FunctionDefaults.isNullOrEmpty(obj);
            }

            return isNullOrEmptyFunc(obj);
        }
        public static isNullOrEmptyFluid<T>(obj: T, isNullOrEmptyFluidFunc?: IFluidFunc<T>): T {
            if (!isNullOrEmptyFluidFunc) {
                return FunctionDefaults.isNullOrEmptyFluid(obj);
            }

            return isNullOrEmptyFluidFunc(obj);
        }
    }
} 