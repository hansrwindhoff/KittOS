/// <reference path="../RequireJs/manager.ts" />

module KittWeb.AngularJs {
    export class Loader {
        private static m_config: RequireConfig = { baseUrl: Loader.getDefaultBaseUrl, paths: Loader.getDefaultPaths }
        private static m_modules: string[] = Loader.getDefaultModules;
        private static m_paths = Loader.getDefaultPaths;

        static get getDefaultBaseUrl(): string { return "../"; }
        static get getDefaultModules(): string[] {
            return [
                "funcDef"
            ];
        }
        static get getDefaultPaths(): { [index: string]: string } {
            return {
                "jsTypes": "Core/Utilities/jsTypes",
                "funcDef": "Core/Utilities/funcDef"
            };
        }

        static get getConfig(): RequireConfig { return Loader.m_config; }
        static set setConfig(value: RequireConfig) { Loader.m_config = value; }
        static get getModules(): string[] { return Loader.m_modules; }
        static set setModules(value: string[]) { Loader.m_modules = value; }
        static get getPaths(): { [index: string]: string } { return Loader.m_paths; }
        static set setPaths(value: { [index: string]: string }) { Loader.m_paths = value; }

        constructor() { throw new Error("Cannot create new instance: KittWeb.AngularJs.Loader is static."); }        
    }
}

self.addEventListener("message", (msg) => {
    if (msg.data == "init") {
        postMessage({ config: KittWeb.AngularJs.Loader.getConfig, modules: KittWeb.AngularJs.Loader.getModules }, null);
    }
});