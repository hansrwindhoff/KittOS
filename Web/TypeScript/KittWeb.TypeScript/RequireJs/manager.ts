/// <reference path="../Scripts/typings/requirejs/require.d.ts" />

module KittWeb.RequireJs {
    export class Manager {
        private static m_config: RequireConfig;
        private static m_modules: string[];
        private static m_paths: { [index: string]: string };
        
        static get getConfig(): RequireConfig { return Manager.m_config; }
        static set setConfig(value: RequireConfig) { Manager.m_config = value; }
        static get getModules(): string[] { return Manager.m_modules; }
        static set setModules(value: string[]) { Manager.m_modules = value; }
        static get getPaths(): { [index: string]: string } { return Manager.m_paths; }
        static set setPaths(value: { [index: string]: string }) { Manager.m_paths = value; }

        static bootstrap(url: string, initFunc?: () => any) {
            var w = new Worker(url);

            if (!initFunc) {
                w.onmessage = (msg) => {
                    Manager.setConfig = msg.data.config;
                    Manager.setModules = msg.data.modules;
                    require.config(Manager.getConfig);
                    require(Manager.m_modules);
                }
            } else {
                w.onmessage = initFunc;
            }

            w.postMessage("init"); // send init message
        }

        constructor() { throw new Error("Cannot create new instance: KittWeb.RequireJs.Manager is static."); }
    }
}