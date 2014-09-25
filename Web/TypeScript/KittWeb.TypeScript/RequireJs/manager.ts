/// <reference path="../Scripts/typings/requirejs/require.d.ts" />

module KittWeb.RequireJs {
    export class Manager {
        private static m_config: RequireConfig = { baseUrl: Manager.getDefaultBaseUrl, paths: Manager.getDefaultPaths }
        private static m_modules: string[] = Manager.getDefaultModules;

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
        
        public static getConfig(): RequireConfig { return Manager.m_config; }
        public static setConfig(value: RequireConfig) { Manager.m_config = value; }

        public static load() {
            require.config(Manager.m_config);
            require(Manager.m_modules);
        }
    }
}
new KittWeb.RequireJs.Manager();