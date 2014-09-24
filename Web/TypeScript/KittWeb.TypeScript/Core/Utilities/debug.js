// Source: https://typescript.codeplex.com/SourceControl/latest#src/compiler/core/debug.ts
define(["require", "exports"], function(require, exports) {
    var Debug;
    (function (_Debug) {
        (function (AssertionLevel) {
            AssertionLevel[AssertionLevel["None"] = 0] = "None";
            AssertionLevel[AssertionLevel["Normal"] = 1] = "Normal";
            AssertionLevel[AssertionLevel["Aggressive"] = 2] = "Aggressive";
            AssertionLevel[AssertionLevel["VeryAggressive"] = 3] = "VeryAggressive";
        })(_Debug.AssertionLevel || (_Debug.AssertionLevel = {}));
        var AssertionLevel = _Debug.AssertionLevel;

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
        _Debug.Debug = Debug;
    })(Debug || (Debug = {}));

    
    return Debug;
});
//# sourceMappingURL=debug.js.map
