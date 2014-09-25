/// <reference path="../Scripts/typings/requirejs/require.d.ts" />

module KittWeb.RequireJs {
    export class Manager {
        private m_config: RequireConfig;
        private m_mainFunc: Function;
        private m_modules: string[];

        // Default configuration
        get getDefaultBaseUrl(): string { return "../"; }
        get getDefaultModules(): string[] {
            return [
                "funcDef"
            ];
        }
        get getDefaultPaths(): { [index: string]: string } {
            return {
                "jsTypes": "Core/Utilities/jsTypes",
                "funcDef": "Core/Utilities/funcDef"
            };
        }

        get getConfig(): RequireConfig { return this.m_config; }
        set setConfig(value: RequireConfig) { this.m_config = value; }

        start(): void {
            require.config(this.getConfig);
            require(this.m_modules, this.m_mainFunc);
        }

        constructor(mainFunc?: Function, config?: RequireConfig, modules?: string[]) {
            if (!config) {
                config = {
                    baseUrl: this.getDefaultBaseUrl,
                    paths: this.getDefaultPaths
                };
            }

            if (!modules) {
                this.m_modules = this.getDefaultModules;
            }

            this.setConfig = config;

            return this;
        }
    }

    export function init(mainFunc?: Function, config?: RequireConfig, modules?: string[]): Manager {
        return new Manager(mainFunc, config, modules);
    }
}