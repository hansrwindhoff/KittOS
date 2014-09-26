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
            Loader.m_config = { baseUrl: Loader.getDefaultBaseUrl, paths: Loader.getDefaultPaths };
            Loader.m_modules = Loader.getDefaultModules;
            return Loader;
        })();
        AngularJs.Loader = Loader;
    })(KittWeb.AngularJs || (KittWeb.AngularJs = {}));
    var AngularJs = KittWeb.AngularJs;
})(KittWeb || (KittWeb = {}));

(function () {
    return KittWeb.AngularJs.Loader.getConfig;
})();
//# sourceMappingURL=loader.js.map
