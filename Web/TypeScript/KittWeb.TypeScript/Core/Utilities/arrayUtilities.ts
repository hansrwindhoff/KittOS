import sdf = require("funcDef");

class ArrayUtilities {
    public static contains<T>(array: T[], value: T, containsFunc?: Function): boolean {
        if (sdf.isNullOrUndefinedFluid(containsFunc)) {
            return sdf.contains(array, value);
        }

        if (sdf.isFunction(containsFunc)) { return containsFunc(array, value); }
    }
    public static createArray<T>(length: number, defaultValue: any, createArrayFunc?: Function): T[] {
        if (sdf.isNullOrUndefinedFluid(createArrayFunc)) {
            return sdf.createArray<T>(length, defaultValue);
        }

        if (sdf.isFunction(createArrayFunc)) { return createArrayFunc(length, defaultValue); }
    }
}

export = ArrayUtilities;                