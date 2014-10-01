define(["require", "exports", "jsTypes"], function(require, exports, jsTypes) {
    var FuncDef = (function () {
        function FuncDef() {
        }
        // Helpers
        FuncDef.truthyCall = function (predicateFunc, func) {
            if (predicateFunc()) {
                func();
            }
        };
        FuncDef.truthyFluid = function (predicateFunc, obj) {
            if (predicateFunc()) {
                return obj;
            }

            return null;
        };
        FuncDef.truthyMulti = function (predicates) {
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
            return (typeof obj) === jsTypes.jsFunction;
        };
        FuncDef.isFunctionFluid = function (obj) {
            var _this = this;
            return this.truthyFluid(function () {
                return _this.isFunction(obj);
            }, obj);
        };
        FuncDef.isNull = function (obj) {
            return obj === null;
        };
        FuncDef.isNullFluid = function (obj) {
            var _this = this;
            return this.truthyFluid(function () {
                return _this.isNull(obj);
            }, obj);
        };
        FuncDef.isNullOrUndefined = function (obj) {
            return this.isNull(obj) || this.isUndefined(obj);
        };
        FuncDef.isNullOrUndefinedFluid = function (obj) {
            var _this = this;
            return this.truthyFluid(function () {
                return _this.isNullOrUndefined(obj);
            }, obj);
        };
        FuncDef.isUndefined = function (obj) {
            return typeof (obj) === jsTypes.jsUndefined;
        };
        FuncDef.isUndefinedFluid = function (obj) {
            var _this = this;
            return this.truthyFluid(function () {
                return _this.isUndefined(obj);
            }, obj);
        };
        return FuncDef;
    })();

    
    return FuncDef;
});
//# sourceMappingURL=funcDef.js.map
