importScripts("../Scripts/require.js");

module KittWeb.RequireJs {
    class Manager {
        private static m_config: RequireConfig;
        private static m_modules: string[];

        static get getConfig(): RequireConfig { return Manager.m_config; }
        static set setConfig(value: RequireConfig) { Manager.m_config = value; }
        static get getModules(): string[] { return Manager.m_modules; }
        static set setModules(value: string[]) { Manager.m_modules = value; }

        static readyFunc: Function;
        static errorFunc: Function;

        constructor() { throw new Error("Cannot create new instance: KittWeb.RequireJs.Manager is static."); }
    }

    // Default configuration
    Manager.setConfig = { baseUrl: "../" };
    Manager.setModules = [];
}

self.addEventListener("message", (msg) => {
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