/// <reference path="../AngularJs/loader.ts" />
importScripts("../Scripts/require.js");

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
            return Manager;
        })();

        // Default configuration
        Manager.setConfig = { baseUrl: "../" };
        Manager.setModules = [];
    })(KittWeb.RequireJs || (KittWeb.RequireJs = {}));
    var RequireJs = KittWeb.RequireJs;
})(KittWeb || (KittWeb = {}));

self.addEventListener("message", function (msg) {
    console.log(msg.data);

    if (msg.data.msgType == "init") {
        postMessage({ msgType: "initResponse", msgContents: "RequireJs initialized." }, null);
    }
    if (msg.data.msgType == "load") {
        var result = importScripts(msg.data.path);
        console.log(result);

        postMessage({ msgType: "loadResponse", msgContents: console.log(msg.data.path) }, null);
    }
});
//# sourceMappingURL=manager.js.map
