define(["require", "exports", "funcDef"], function(require, exports, sdf) {
    var ArrayUtilities = (function () {
        function ArrayUtilities() {
        }
        ArrayUtilities.contains = function (array, value, containsFunc) {
            if (sdf.isNullOrUndefinedFluid(containsFunc)) {
                return sdf.contains(array, value);
            }

            if (sdf.isFunction(containsFunc)) {
                return containsFunc(array, value);
            }
        };
        ArrayUtilities.createArray = function (length, defaultValue, createArrayFunc) {
            if (sdf.isNullOrUndefinedFluid(createArrayFunc)) {
                return sdf.createArray(length, defaultValue);
            }

            if (sdf.isFunction(createArrayFunc)) {
                return createArrayFunc(length, defaultValue);
            }
        };
        return ArrayUtilities;
    })();

    
    return ArrayUtilities;
});
//# sourceMappingURL=arrayUtilities.js.map
