/// <reference path="../Scripts/typings/requirejs/require.d.ts" />
var KittWeb;
(function (KittWeb) {
    (function (RequireJs) {
        var Manager = (function () {
            function Manager() {
                throw new Error("Cannot create new instance: KittWeb.RequireJs.Manager is static.");
            }
            Object.defineProperty(Manager, "getConfig", {
                get: function () {
                    return Manager.m_config;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Manager, "setConfig", {
                set: function (value) {
                    Manager.m_config = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Manager, "getModules", {
                get: function () {
                    return Manager.m_modules;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Manager, "setModules", {
                set: function (value) {
                    Manager.m_modules = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Manager, "getPaths", {
                get: function () {
                    return Manager.m_paths;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Manager, "setPaths", {
                set: function (value) {
                    Manager.m_paths = value;
                },
                enumerable: true,
                configurable: true
            });

            Manager.bootstrap = function (url, initFunc) {
                var w = new Worker(url);

                if (!initFunc) {
                    w.onmessage = function (msg) {
                        Manager.setConfig = msg.data.config;
                        Manager.setModules = msg.data.modules;
                        require.config(Manager.getConfig);
                        require(Manager.m_modules);
                    };
                } else {
                    w.onmessage = initFunc;
                }

                w.postMessage("init"); // send init message
            };
            return Manager;
        })();
        RequireJs.Manager = Manager;
    })(KittWeb.RequireJs || (KittWeb.RequireJs = {}));
    var RequireJs = KittWeb.RequireJs;
})(KittWeb || (KittWeb = {}));
//# sourceMappingURL=manager.js.map
