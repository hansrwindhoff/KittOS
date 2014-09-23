// Partial Source: https://typescript.codeplex.com/SourceControl/latest#src/compiler/core/errors.ts
///<reference path='references.ts' />

module TypeScript {
    export class Errors {
        public static argumentOutOfRange(argument: string): Error {
            return new Error("Argument out of range: " + argument);
        }

        public static argumentNull(argument: string): Error {
            return new Error("Argument null: " + argument);
        }

        public static notImplemented(): Error {
            return new Error("Not implemented.");
        }

        public static notYetImplemented(): Error {
            return new Error("Not yet implemented.");
        }

        public static invalidArgument(argument: string, message?: string): Error {
            return new Error("Invalid argument: " + argument + ". " + message);
        }

        public static invalidOperation(message?: string): Error {
            return new Error("Invalid operation: " + message);
        }        
    }

    export class JsTypes {
        public static JsBoolean = "boolean";
        public static JsFunction = "function";
        public static JsNumber = "number";
        public static JsObject = "object";
        public static JsString = "string";
        public static JsUndefined = "undefined";
    }
} 