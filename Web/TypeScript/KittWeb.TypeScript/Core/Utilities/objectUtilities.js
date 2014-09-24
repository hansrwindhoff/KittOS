///<reference path='../references.ts' />
var KittWeb;
(function (KittWeb) {
    var ObjectUtilities = (function () {
        function ObjectUtilities() {
        }
        ObjectUtilities.isFunction = function (obj, isFunctionFunc) {
            if (this.isNullOrUndefined) {
                return KittWeb.FunctionDefaults.isFunction(obj);
            }

            return isFunctionFunc(obj);
        };
        ObjectUtilities.isNullOrUndefined = function (obj, isNullOrUndefinedFunc) {
            // Check if custom function was provided
            if (KittWeb.FunctionDefaults.isNullOrUndefined(isNullOrUndefinedFunc)) {
                return KittWeb.FunctionDefaults.isNullOrUndefined(obj);
            }

            return isNullOrUndefinedFunc(obj);
        };
        ObjectUtilities.isNullOrUndefinedFluid = function (obj, isNullOrUndefinedFluidFunc) {
            // Check if custom function was provided
            if (KittWeb.FunctionDefaults.isNullOrUndefined(isNullOrUndefinedFluidFunc)) {
                return KittWeb.FunctionDefaults.isNullOrUndefinedFluid(obj);
            }

            return isNullOrUndefinedFluidFunc(obj);
        };
        return ObjectUtilities;
    })();
    KittWeb.ObjectUtilities = ObjectUtilities;
})(KittWeb || (KittWeb = {}));
//# sourceMappingURL=objectUtilities.js.map
