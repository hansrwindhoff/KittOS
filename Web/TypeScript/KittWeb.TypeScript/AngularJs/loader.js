/// <reference path="../RequireJs/manager.ts" />
var KittWeb;
(function (KittWeb) {
    (function (AngularJs) {
        var Loader = (function () {
            function Loader() {
                throw new Error("Cannot create new instance: KittWeb.AngularJs.Loader is static.");
            }
            Object.defineProperty(Loader, "getDefaultModules", {
                get: function () {
                    return [
                        "main"
                    ];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loader, "getDefaultPaths", {
                get: function () {
                    return {
                        "jsTypes": "../Core/Utilities/jsTypes",
                        "main": "../AngularJs/main"
                    };
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Loader, "getConfig", {
                get: function () {
                    return Loader.m_config;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loader, "setConfig", {
                set: function (value) {
                    Loader.m_config = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loader, "getModules", {
                get: function () {
                    return Loader.m_modules;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loader, "setModules", {
                set: function (value) {
                    Loader.m_modules = value;
                },
                enumerable: true,
                configurable: true
            });
            Loader.m_config = { paths: Loader.getDefaultPaths };
            Loader.m_modules = Loader.getDefaultModules;
            return Loader;
        })();
        AngularJs.Loader = Loader;

        // Auto-initialize when imported
        KittWeb.RequireJs.Manager.setConfig = Loader.getConfig;
        KittWeb.RequireJs.Manager.setModules = Loader.getModules;
    })(KittWeb.AngularJs || (KittWeb.AngularJs = {}));
    var AngularJs = KittWeb.AngularJs;
})(KittWeb || (KittWeb = {}));
//# sourceMappingURL=loader.js.map
