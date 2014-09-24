// Source: https://typescript.codeplex.com/SourceControl/latest#src/compiler/core/errors.ts
define(["require", "exports"], function(require, exports) {
    var Errors = (function () {
        function Errors() {
        }
        Errors.argumentOutOfRange = function (argument) {
            return new Error("Argument out of range: " + argument);
        };

        Errors.argumentNull = function (argument) {
            return new Error("Argument null: " + argument);
        };

        Errors.notImplemented = function () {
            return new Error("Not implemented.");
        };

        Errors.notYetImplemented = function () {
            return new Error("Not yet implemented.");
        };

        Errors.invalidArgument = function (argument, message) {
            return new Error("Invalid argument: " + argument + ". " + message);
        };

        Errors.invalidOperation = function (message) {
            return new Error("Invalid operation: " + message);
        };
        return Errors;
    })();

    
    return Errors;
});
//# sourceMappingURL=errors.js.map
