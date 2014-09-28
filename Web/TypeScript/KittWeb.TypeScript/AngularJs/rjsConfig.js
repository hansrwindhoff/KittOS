///// <reference path="../RequireJs/manager.ts" />
//module KittWeb.AngularJs {
//    export class RjsConfig {
//        private static m_config: RequireConfig = {
//            paths: {
//                "jquery": "../Scripts/jquery-2.1.1",
//                "angular": "../Scripts/angular",
//                "angular-resource": "../Scripts/angular-resource",
//            },
//            shim: {
//                "jquery": { exports: "jquery" },
//                "angular": { exports: "angular", dep: ["jquery"] },
//                "angular-resource": { exports: "angular-resource", deps: ["angular"] },
//            }
//        }
//        private static m_modules: string[] = [
//            "angular-resource"
//        ];
//        static get getConfig(): RequireConfig { return RjsConfig.m_config; }
//        static set setConfig(value: RequireConfig) { RjsConfig.m_config = value; }
//        static get getModules(): string[] { return RjsConfig.m_modules; }
//        static set setModules(value: string[]) { RjsConfig.m_modules = value; }
//        constructor() { throw new Error("Cannot create new instance: KittWeb.AngularJs.RjsConfig is static."); }
//    }
//    // Auto-initialize when imported
//    KittWeb.RequireJs.Manager.setConfig = RjsConfig.getConfig;
//    KittWeb.RequireJs.Manager.setModules = RjsConfig.getModules;
//}
//# sourceMappingURL=rjsConfig.js.map
