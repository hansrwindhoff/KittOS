module KittWeb.AngularJs {
    export class Loader {
        private static m_config: RequireConfig = { baseUrl: Loader.getDefaultBaseUrl, paths: Loader.getDefaultPaths }
        private static m_modules: string[] = Loader.getDefaultModules;

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

        constructor() { throw new Error("Cannot create new instance: KittWeb.AngularJs.Loader is static."); }        
    }
}

(() => { return KittWeb.AngularJs.Loader.getConfig; })();