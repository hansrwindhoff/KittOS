///<reference path='../references.ts' />
var TypeScript;
(function (TypeScript) {
    var FunctionDefaults = (function () {
        function FunctionDefaults() {
        }
        // arrayUtilities
        FunctionDefaults.contains = function (array, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === value) {
                    return true;
                }
            }
        };

        // functionUtilities
        FunctionDefaults.isFunction = function (obj) {
            return (typeof obj) === TypeScript.JsTypes.JsFunction;
        };
        FunctionDefaults.isNullOrEmpty = function (obj) {
            if (obj) {
                return true;
            }

            return false;
        };
        FunctionDefaults.isNullOrEmptyFluid = function (obj) {
            if (obj) {
                return obj;
            }

            return null;
        };
        return FunctionDefaults;
    })();
    TypeScript.FunctionDefaults = FunctionDefaults;
})(TypeScript || (TypeScript = {}));
//# sourceMappingURL=functionDefaults.js.map
