/// <reference path="../Scripts/typings/requirejs/require.d.ts" />
var KittWeb;
(function (KittWeb) {
    (function (RequireJs) {
        var Manager = (function () {
            function Manager(mainFunc, config, modules) {
                if (!config) {
                    config = {
                        baseUrl: this.getDefaultBaseUrl,
                        paths: this.getDefaultPaths
                    };
                }

                if (!modules) {
                    this.m_modules = this.getDefaultModules;
                }

                this.setConfig = config;

                return this;
            }
            Object.defineProperty(Manager.prototype, "getDefaultBaseUrl", {
                // Default configuration
                get: function () {
                    return "../";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Manager.prototype, "getDefaultModules", {
                get: function () {
                    return [
                        "funcDef"
                    ];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Manager.prototype, "getDefaultPaths", {
                get: function () {
                    return {
                        "jsTypes": "Core/Utilities/jsTypes",
                        "funcDef": "Core/Utilities/funcDef"
                    };
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Manager.prototype, "getConfig", {
                get: function () {
                    return this.m_config;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Manager.prototype, "setConfig", {
                set: function (value) {
                    this.m_config = value;
                },
                enumerable: true,
                configurable: true
            });

            Manager.prototype.start = function () {
                require.config(this.getConfig);
                require(this.m_modules, this.m_mainFunc);
            };
            return Manager;
        })();
        RequireJs.Manager = Manager;

        function init(mainFunc, config, modules) {
            return new Manager(mainFunc, config, modules);
        }
        RequireJs.init = init;
    })(KittWeb.RequireJs || (KittWeb.RequireJs = {}));
    var RequireJs = KittWeb.RequireJs;
})(KittWeb || (KittWeb = {}));
//# sourceMappingURL=requireJsMain.js.map
