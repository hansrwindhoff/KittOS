import JsTypes = require("jsTypes");

class FuncDef {
    // Helpers
    static truthyCall(predicateFunc: () => boolean, func: () => boolean) {
        if (predicateFunc()) { // function only executes if predicate evaluates to true
            func();
        }
    }
    static truthyFluid<T>(predicateFunc: () => boolean, obj: T): T {
        if (predicateFunc()) {
            return obj; // return obj if predicate evaluates to true
        }

        return null; // return null if predicate evaluates to false
    }
    static truthyMulti(predicates: Array<() => boolean>) {
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
    static contains<T>(arr: T[], value: T): boolean {
        for (var i: number = 0; i < arr.length; i++) {
            if (arr[i] === value) {
                return true;
            }

            return false;
        }
    }
    static createArray<T>(length: number, defaultValue: any): T[] {
        var result = new Array<T>(length);

        for (var i: number = 0; i < length; i++) {
            result[i] = defaultValue;
        }

        return result;
    }

    // Object Related
    static isFunction(obj: any): boolean {
        return (typeof obj) === JsTypes.jsFunction; // return true if obj is a function
    }
    static isFunctionFluid<T>(obj: T): T {
        return this.truthyFluid(() => { return this.isFunction(obj); }, obj);
    }
    static isNull(obj: any): boolean {
        return obj === null; // return true if obj is null
    }
    static isNullFluid<T>(obj: T): T {
        return this.truthyFluid(() => { return this.isNull(obj); }, obj);
    }
    static isNullOrUndefined(obj: any): boolean {
        return this.isNull(obj) || this.isUndefined(obj); // return true if obj is not null or undefined
    }
    static isNullOrUndefinedFluid<T>(obj: T): T {
        return this.truthyFluid(() => { return this.isNullOrUndefined(obj); }, obj);
    }
    static isUndefined(obj: any): boolean {
        return typeof (obj) === JsTypes.jsUndefined; // return true if obj is undefined
    }
    static isUndefinedFluid<T>(obj: T): T {
        return this.truthyFluid(() => { return this.isUndefined(obj); }, obj);
    }
}

export = FuncDef;