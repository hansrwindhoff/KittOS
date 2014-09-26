/// <reference path="../RequireJs/manager.ts" />
var KittWeb;
(function (KittWeb) {
    (function (AngularJs) {
        var Loader = (function () {
            function Loader() {
                throw new Error("Cannot create new instance: KittWeb.AngularJs.Loader is static.");
            }
            Object.defineProperty(Loader, "getDefaultBaseUrl", {
                get: function () {
                    return "../";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loader, "getDefaultModules", {
                get: function () {
                    return [
                        "funcDef"
                    ];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loader, "getDefaultPaths", {
                get: function () {
                    return {
                        "jsTypes": "Core/Utilities/jsTypes",
                        "funcDef": "Core/Utilities/funcDef"
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
            Object.defineProperty(Loader, "getPaths", {
                get: function () {
                    return Loader.m_paths;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loader, "setPaths", {
                set: function (value) {
                    Loader.m_paths = value;
                },
                enumerable: true,
                configurable: true
            });
            Loader.m_config = { baseUrl: Loader.getDefaultBaseUrl, paths: Loader.getDefaultPaths };
            Loader.m_modules = Loader.getDefaultModules;
            Loader.m_paths = Loader.getDefaultPaths;
            return Loader;
        })();
        AngularJs.Loader = Loader;
    })(KittWeb.AngularJs || (KittWeb.AngularJs = {}));
    var AngularJs = KittWeb.AngularJs;
})(KittWeb || (KittWeb = {}));

self.addEventListener("message", function (msg) {
    if (msg.data == "init") {
        postMessage({ config: KittWeb.AngularJs.Loader.getConfig, modules: KittWeb.AngularJs.Loader.getModules }, null);
    }
});
//# sourceMappingURL=loader.js.map
