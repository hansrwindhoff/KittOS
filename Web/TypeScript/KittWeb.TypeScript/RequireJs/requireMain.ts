/// <reference path="../Scripts/typings/requirejs/require.d.ts" />

module KittWeb {
    export class RequireMain {
        private m_mainFunc: Function;

        get defaultBaseUrl(): string { return "../"; }
        get defaultModules(): string[] {
            return [
                "funcDef"
            ];
        }
        get defaultPaths(): { [index: string]: string } {
            return {
                "jsTypes": "Core/Utilities/jsTypes",
                "funcDef": "Core/Utilities/funcDef"
            };
        }

        constructor(mainFunc: Function, config?: RequireConfig, modules?: string[]) {
            if (!config) {
                config = {
                    baseUrl: this.defaultBaseUrl,
                    paths: this.defaultPaths
                };
            }

            if (!modules) {
                modules = this.defaultModules;
            }
            require.config(config);
            require(modules, mainFunc);
        }
    }
}