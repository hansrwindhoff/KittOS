///<reference path='_references.ts' />
var KittWeb;
(function (KittWeb) {
    var ArrayUtilities = (function () {
        function ArrayUtilities() {
        }
        ArrayUtilities.contains = function (array, value, containsFunc) {
            if (KittWeb.FuncDef.isNullOrUndefinedFluid(containsFunc)) {
                return KittWeb.FuncDef.contains(array, value);
            }

            if (KittWeb.FuncDef.isFunction(containsFunc)) {
                return containsFunc(array, value);
            }
        };
        ArrayUtilities.createArray = function (length, defaultValue, createArrayFunc) {
            if (KittWeb.FuncDef.isNullOrUndefinedFluid(createArrayFunc)) {
                return KittWeb.FuncDef.createArray(length, defaultValue);
            }

            if (KittWeb.FuncDef.isFunction(createArrayFunc)) {
                return createArrayFunc(length, defaultValue);
            }
        };
        return ArrayUtilities;
    })();
    KittWeb.ArrayUtilities = ArrayUtilities;
})(KittWeb || (KittWeb = {}));
//# sourceMappingURL=arrayUtilities.js.map
