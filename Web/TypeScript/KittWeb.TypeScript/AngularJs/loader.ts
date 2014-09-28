/// <reference path="../RequireJs/manager.ts" />

module KittWeb.AngularJs {
    export class Loader {
        private static m_config: RequireConfig = { paths: Loader.getDefaultPaths }
        private static m_modules: string[] = Loader.getDefaultModules;

        static get getDefaultModules(): string[] {
            return [
                "main"
            ];
        }
        static get getDefaultPaths(): { [index: string]: string } {
            return {
                "jsTypes": "../Core/Utilities/jsTypes",
                "main": "../AngularJs/main",
            };
        }

        static get getConfig(): RequireConfig { return Loader.m_config; }
        static set setConfig(value: RequireConfig) { Loader.m_config = value; }
        static get getModules(): string[] { return Loader.m_modules; }
        static set setModules(value: string[]) { Loader.m_modules = value; }

        constructor() { throw new Error("Cannot create new instance: KittWeb.AngularJs.Loader is static."); }
    }

    // Auto-initialize when imported
    KittWeb.RequireJs.Manager.setConfig = Loader.getConfig;
    KittWeb.RequireJs.Manager.setModules = Loader.getModules;
}