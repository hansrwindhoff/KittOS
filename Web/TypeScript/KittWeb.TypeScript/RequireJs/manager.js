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
        RequireJs.Manager = Manager;

        // Default configuration
        Manager.setConfig = { baseUrl: "../" };
        Manager.setModules = [];
    })(KittWeb.RequireJs || (KittWeb.RequireJs = {}));
    var RequireJs = KittWeb.RequireJs;
})(KittWeb || (KittWeb = {}));

self.addEventListener("message", function (msg) {
    var result = msg.data;

    if (result.msgType === "init") {
        self.postMessage({ msgType: "managerReponse", msgContents: "KittWeb.RequireJs.Manager initialized." }, null);
    }

    if (result.msgType === "importConfig") {
        importScripts(msg.data.msgContents);

        self.postMessage({ msgType: "managerResponse", msgContents: msg.data.msgContents + " imported.", test: KittWeb.RequireJs.Manager.getConfig }, null);
    }
});
//# sourceMappingURL=manager.js.map
