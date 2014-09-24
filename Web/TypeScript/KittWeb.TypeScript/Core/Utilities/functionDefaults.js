///<reference path='../references.ts' />
var KittWeb;
(function (KittWeb) {
    var FunctionDefaults = (function () {
        function FunctionDefaults() {
        }
        // Array Related
        FunctionDefaults.contains = function (array, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === value) {
                    return true;
                }

                return false;
            }
        };

        // Function Related
        FunctionDefaults.callFunction = function (func, predicateFunc) {
            if (predicateFunc()) {
                func();
            }
        };

        // Helpers
        // Object Related
        FunctionDefaults.isFunction = function (obj, shouldThrow) {
            if (typeof shouldThrow === "undefined") { shouldThrow = false; }
            return (typeof obj) === KittWeb.JsTypes.JsFunction;
        };
        FunctionDefaults.isFunctionFluid = function (obj) {
            if (!this.isFunction(obj)) {
                return obj;
            }

            return null;
        };
        FunctionDefaults.isNull = function (obj) {
            return obj === null;
        };
        FunctionDefaults.isNullFluid = function (obj) {
            if (!this.isNull(obj)) {
                return obj;
            }

            return null;
        };
        FunctionDefaults.isNullOrUndefined = function (obj) {
            return this.isNull(obj) || this.isUndefined(obj);
        };
        FunctionDefaults.isNullOrUndefinedFluid = function (obj) {
            if (!this.isNullOrUndefined(obj)) {
                return obj;
            }

            return null;
        };
        FunctionDefaults.isUndefined = function (obj) {
            return typeof (obj) === KittWeb.JsTypes.JsUndefined;
        };
        FunctionDefaults.isUndefinedFluid = function (obj) {
            if (!this.isUndefined(obj)) {
                return obj;
            }

            return null;
        };
        return FunctionDefaults;
    })();
    KittWeb.FunctionDefaults = FunctionDefaults;
})(KittWeb || (KittWeb = {}));

console.log("Init");
var f = new KittWeb.FunctionDefaults();

KittWeb.FunctionDefaults.callFunction(function () {
    console.log("HI");
}, function () {
    return 1 === 2;
});
//# sourceMappingURL=functionDefaults.js.map
