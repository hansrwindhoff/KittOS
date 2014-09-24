///<reference path='_references.ts' />

module KittWeb {
    export class ArrayUtilities {
        public static contains<T>(array: T[], value: T, containsFunc?: Function): boolean {
            if (FuncDef.isNullOrUndefinedFluid(containsFunc)) {
                return FuncDef.contains(array, value);
            }

            if (FuncDef.isFunction(containsFunc)) { return containsFunc(array, value); }
        }
        public static createArray<T>(length: number, defaultValue: any, createArrayFunc?: Function): T[] {
            if (FuncDef.isNullOrUndefinedFluid(createArrayFunc)) {
                return FuncDef.createArray<T>(length, defaultValue);
            }

            if (FuncDef.isFunction(createArrayFunc)) { return createArrayFunc(length, defaultValue); }
        }
    }
}