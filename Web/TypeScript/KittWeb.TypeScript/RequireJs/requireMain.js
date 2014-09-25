/// <reference path="../Scripts/typings/requirejs/require.d.ts" />
var KittWeb;
(function (KittWeb) {
    var RequireMain = (function () {
        function RequireMain(mainFunc, config, modules) {
            if (!config) {
                config = {
                    baseUrl: this.defaultBaseUrl,
                    paths: this.defaultPaths
                };
            }

            if (!modules) {
                modules = this.defaultModules;
            }
            require.config(config);
            require(modules, mainFunc);
        }
        Object.defineProperty(RequireMain.prototype, "defaultBaseUrl", {
            get: function () {
                return "../";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RequireMain.prototype, "defaultModules", {
            get: function () {
                return [
                    "funcDef"
                ];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RequireMain.prototype, "defaultPaths", {
            get: function () {
                return {
                    "jsTypes": "Core/Utilities/jsTypes",
                    "funcDef": "Core/Utilities/funcDef"
                };
            },
            enumerable: true,
            configurable: true
        });
        return RequireMain;
    })();
    KittWeb.RequireMain = RequireMain;
})(KittWeb || (KittWeb = {}));
//# sourceMappingURL=requireMain.js.map
