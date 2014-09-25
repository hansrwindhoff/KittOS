/// <reference path="../Scripts/typings/requirejs/require.d.ts" />

module KittWeb.RequireJs {
    export class Manager {
        private static m_config: RequireConfig = { baseUrl: Manager.getDefaultBaseUrl, paths: Manager.getDefaultPaths }
        private static m_modules: string[];

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

        get getConfig(): RequireConfig { return Manager.m_config; }
        set setConfig(value: RequireConfig) { Manager.m_config = value; }

        public load(): Manager {
            require(Manager.m_modules);

            return this;
        }

        constructor(config?: RequireConfig, modules?: string[]) {
            if (config) { Manager.m_config = config; }
            if (modules) { Manager.m_modules = modules; }
        }
    }
}