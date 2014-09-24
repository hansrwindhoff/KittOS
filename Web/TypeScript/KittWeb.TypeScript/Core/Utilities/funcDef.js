///<reference path="_references.ts" />
var KittWeb;
(function (KittWeb) {
    var JsTypes = (function () {
        function JsTypes() {
        }
        JsTypes.JsBoolean = "boolean";
        JsTypes.JsFunction = "function";
        JsTypes.JsNumber = "number";
        JsTypes.JsObject = "object";
        JsTypes.JsString = "string";
        JsTypes.JsUndefined = "undefined";
        return JsTypes;
    })();
    KittWeb.JsTypes = JsTypes;

    var FuncDef = (function () {
        function FuncDef() {
        }
        // Helpers
        FuncDef.evalCall = function (predicateFunc, func) {
            if (predicateFunc()) {
                func();
            }
        };
        FuncDef.evalFluid = function (predicateFunc, obj) {
            if (predicateFunc()) {
                return obj;
            }

            return null;
        };
        FuncDef.evalMulti = function (predicates) {
            var result = predicates[0]();

            if (result && predicates.length > 1) {
                for (var i = 1; i < predicates.length; i++) {
                    result = (result && predicates[i]()); // perform logical OR

                    if (!result) {
                        return result;
                    }
                }
            }

            return result;
        };
        FuncDef.evalThrow = function (predicateFunc, errorFunc) {
            if (!predicateFunc()) {
                errorFunc();
            }
        };

        // Array Related
        FuncDef.contains = function (arr, value) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === value) {
                    return true;
                }

                return false;
            }
        };
        FuncDef.createArray = function (length, defaultValue) {
            var result = new Array(length);

            for (var i = 0; i < length; i++) {
                result[i] = defaultValue;
            }

            return result;
        };

        // Object Related
        FuncDef.isFunction = function (obj) {
            return (typeof obj) === JsTypes.JsFunction;
        };
        FuncDef.isFunctionFluid = function (obj) {
            var _this = this;
            return this.evalFluid(function () {
                return _this.isFunction(obj);
            }, obj);
        };
        FuncDef.isNull = function (obj) {
            return obj === null;
        };
        FuncDef.isNullFluid = function (obj) {
            var _this = this;
            return this.evalFluid(function () {
                return _this.isNull(obj);
            }, obj);
        };
        FuncDef.isNullOrUndefined = function (obj) {
            return this.isNull(obj) || this.isUndefined(obj);
        };
        FuncDef.isNullOrUndefinedFluid = function (obj) {
            var _this = this;
            return this.evalFluid(function () {
                return _this.isNullOrUndefined(obj);
            }, obj);
        };
        FuncDef.isUndefined = function (obj) {
            return typeof (obj) === JsTypes.JsUndefined;
        };
        FuncDef.isUndefinedFluid = function (obj) {
            var _this = this;
            return this.evalFluid(function () {
                return _this.isUndefined(obj);
            }, obj);
        };
        return FuncDef;
    })();
    KittWeb.FuncDef = FuncDef;
})(KittWeb || (KittWeb = {}));
//# sourceMappingURL=funcDef.js.map
