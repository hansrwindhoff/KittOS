/// <reference path="../Scripts/typings/requirejs/require.d.ts" />
var KittWeb;
(function (KittWeb) {
    (function (RequireJs) {
        var Manager = (function () {
            function Manager() {
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

            Manager.getConfig = function () {
                return Manager.m_config;
            };
            Manager.setConfig = function (value) {
                Manager.m_config = value;
            };

            Manager.load = function () {
                require.config(Manager.m_config);
                require(Manager.m_modules);
            };
            Manager.m_config = { baseUrl: Manager.getDefaultBaseUrl, paths: Manager.getDefaultPaths };
            Manager.m_modules = Manager.getDefaultModules;
            return Manager;
        })();
        RequireJs.Manager = Manager;
    })(KittWeb.RequireJs || (KittWeb.RequireJs = {}));
    var RequireJs = KittWeb.RequireJs;
})(KittWeb || (KittWeb = {}));
new KittWeb.RequireJs.Manager();
//# sourceMappingURL=manager.js.map
