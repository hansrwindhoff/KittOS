module KittWeb.RequireJs {
    export class Manager {
        private static m_config: RequireConfig;
        private static m_modules: string[];

        static get getConfig(): RequireConfig { return Manager.m_config; }
        static set setConfig(value: RequireConfig) { Manager.m_config = value; }
        static get getModules(): string[] { return Manager.m_modules; }
        static set setModules(value: string[]) { Manager.m_modules = value; }  

        constructor() { throw new Error("Cannot create new instance: KittWeb.RequireJs.Manager is static."); }
    }

    // Default configuration
    Manager.setConfig = { baseUrl: "../" };
    Manager.setModules = [];
}

self.addEventListener("message", (msg) => {
    var result = msg.data;

    if (result.msgType === "init") {
        self.postMessage({ msgType: "managerReponse", msgContents: "KittWeb.RequireJs.Manager initialized." }, null);
    }

    if (result.msgType === "importConfig") {
        importScripts(msg.data.msgContents);

        self.postMessage({ msgType: "managerResponse", msgContents: msg.data.msgContents + " imported.", test: KittWeb.RequireJs.Manager.getConfig }, null);
    }
});