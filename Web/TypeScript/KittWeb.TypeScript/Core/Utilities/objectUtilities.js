///<reference path='../references.ts' />
var TypeScript;
(function (TypeScript) {
    var ObjectUtilities = (function () {
        function ObjectUtilities() {
        }
        ObjectUtilities.isFunction = function (obj, isFunctionFunc) {
            if (!isFunctionFunc) {
                return TypeScript.FunctionDefaults.isFunction(obj);
            }

            return isFunctionFunc(obj);
        };
        ObjectUtilities.isNullOrEmpty = function (obj, isNullOrEmptyFunc) {
            if (!isNullOrEmptyFunc) {
                return TypeScript.FunctionDefaults.isNullOrEmpty(obj);
            }

            return isNullOrEmptyFunc(obj);
        };
        ObjectUtilities.isNullOrEmptyFluid = function (obj, isNullOrEmptyFluidFunc) {
            if (!isNullOrEmptyFluidFunc) {
                return TypeScript.FunctionDefaults.isNullOrEmptyFluid(obj);
            }

            return isNullOrEmptyFluidFunc(obj);
        };
        return ObjectUtilities;
    })();
    TypeScript.ObjectUtilities = ObjectUtilities;
})(TypeScript || (TypeScript = {}));
//# sourceMappingURL=objectUtilities.js.map
