///<reference path='../references.ts' />
var TypeScript;
(function (TypeScript) {
    var FunctionUtilities = (function () {
        function FunctionUtilities() {
        }
        FunctionUtilities.isFunction = function (obj, isFunctionFunc) {
            if (!isFunctionFunc) {
                return TypeScript.FunctionDefaults.isFunction(obj);
            }

            return isFunctionFunc(obj);
        };
        return FunctionUtilities;
    })();
    TypeScript.FunctionUtilities = FunctionUtilities;
})(TypeScript || (TypeScript = {}));
//# sourceMappingURL=functionUtilities.js.map
