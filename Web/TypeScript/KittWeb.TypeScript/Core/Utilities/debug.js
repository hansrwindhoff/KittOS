﻿// Source: https://typescript.codeplex.com/SourceControl/latest#src/compiler/core/debug.ts
///<reference path='../references.ts' />
var KittWeb;
(function (KittWeb) {
    (function (AssertionLevel) {
        AssertionLevel[AssertionLevel["None"] = 0] = "None";
        AssertionLevel[AssertionLevel["Normal"] = 1] = "Normal";
        AssertionLevel[AssertionLevel["Aggressive"] = 2] = "Aggressive";
        AssertionLevel[AssertionLevel["VeryAggressive"] = 3] = "VeryAggressive";
    })(KittWeb.AssertionLevel || (KittWeb.AssertionLevel = {}));
    var AssertionLevel = KittWeb.AssertionLevel;

    var Debug = (function () {
        function Debug() {
        }
        Debug.shouldAssert = function (level) {
            return this.currentAssertionLevel >= level;
        };

        Debug.assert = function (expression, message, verboseDebugInfo) {
            if (typeof message === "undefined") { message = ""; }
            if (typeof verboseDebugInfo === "undefined") { verboseDebugInfo = null; }
            if (!expression) {
                var verboseDebugString = "";
                if (verboseDebugInfo) {
                    verboseDebugString = "\r\nVerbose Debug Information:" + verboseDebugInfo();
                }

                throw new Error("Debug Failure. False expression: " + message + verboseDebugString);
            }
        };

        Debug.fail = function (message) {
            Debug.assert(false, message);
        };
        Debug.currentAssertionLevel = 0 /* None */;
        return Debug;
    })();
    KittWeb.Debug = Debug;
})(KittWeb || (KittWeb = {}));
//# sourceMappingURL=debug.js.map