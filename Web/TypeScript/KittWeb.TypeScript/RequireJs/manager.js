/// <reference path="../Scripts/typings/requirejs/require.d.ts" />
var KittWeb;
(function (KittWeb) {
    (function (RequireJs) {
        var Manager = (function () {
            function Manager(config, modules) {
                if (config) {
                    Manager.m_config = config;
                }
                if (modules) {
                    Manager.m_modules = modules;
                }
            }
            Object.defineProperty(Manager, "getDefaultBaseUrl", {
                get: function () {
                    return "../";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Manager, "getDefaultModules", {
                get: function () {
                    return [
                        "funcDef"
                    ];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Manager, "getDefaultPaths", {
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
                    return Manager.m_config;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Manager.prototype, "setConfig", {
                set: function (value) {
                    Manager.m_config = value;
                },
                enumerable: true,
                configurable: true
            });

            Manager.prototype.load = function () {
                require(Manager.m_modules);

                return this;
            };
            Manager.m_config = { baseUrl: Manager.getDefaultBaseUrl, paths: Manager.getDefaultPaths };
            return Manager;
        })();
        RequireJs.Manager = Manager;
    })(KittWeb.RequireJs || (KittWeb.RequireJs = {}));
    var RequireJs = KittWeb.RequireJs;
})(KittWeb || (KittWeb = {}));
//# sourceMappingURL=manager.js.map
