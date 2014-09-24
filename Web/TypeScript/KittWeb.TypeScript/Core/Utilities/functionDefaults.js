///<reference path='../references.ts' />
var KittWeb;
(function (KittWeb) {
    var FunctionDefaults = (function () {
        function FunctionDefaults() {
        }
        // Helpers
        FunctionDefaults.evaluateFluid = function (obj, predicateFunc) {
            if (predicateFunc()) {
                return obj;
            }

            return null;
        };
        FunctionDefaults.callFunction = function (func, predicateFunc) {
            if (predicateFunc()) {
                func();
            }
        };

        // Array Related
        FunctionDefaults.contains = function (array, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === value) {
                    return true;
                }

                return false;
            }
        };

        // Object Related
        FunctionDefaults.isFunction = function (obj) {
            return (typeof obj) === KittWeb.JsTypes.JsFunction;
        };
        FunctionDefaults.isFunctionFluid = function (obj) {
            var _this = this;
            return this.evaluateFluid(obj, function () {
                return _this.isFunction(obj);
            });
        };
        FunctionDefaults.isNull = function (obj) {
            return obj === null;
        };
        FunctionDefaults.isNullFluid = function (obj) {
            var _this = this;
            return this.evaluateFluid(obj, function () {
                return _this.isNull(obj);
            });
        };
        FunctionDefaults.isNullOrUndefined = function (obj) {
            return this.isNull(obj) || this.isUndefined(obj);
        };
        FunctionDefaults.isNullOrUndefinedFluid = function (obj) {
            var _this = this;
            return this.evaluateFluid(obj, function () {
                return _this.isNullOrUndefined(obj);
            });
        };
        FunctionDefaults.isUndefined = function (obj) {
            return typeof (obj) === KittWeb.JsTypes.JsUndefined;
        };
        FunctionDefaults.isUndefinedFluid = function (obj) {
            var _this = this;
            return this.evaluateFluid(obj, function () {
                return _this.isUndefined(obj);
            });
        };
        return FunctionDefaults;
    })();
    KittWeb.FunctionDefaults = FunctionDefaults;
})(KittWeb || (KittWeb = {}));
//# sourceMappingURL=functionDefaults.js.map
