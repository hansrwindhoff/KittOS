module ktw {
    export class Module {
        id: string;
        dependencies: Array<string>;
        exports: Object;
        exportValue: any;
        factory: Function;

        constructor(id?: string, dependencies?: Array<string>, factory?: Function, exportValue?: any) {
            this.id = id;
            this.dependencies = dependencies || ["require", "exports", "module"];
            this.exports = {};
            this.factory = factory;

            if (!factory) { this.exportValue = exportValue || {}; }
        }
    }
    export class Utilities {
        static addEvent: (element: Element, name: string, func: EventListener) => Function;
        static appendScriptNode(node: HTMLScriptElement): Function {
            var head: HTMLHeadElement = document.head || document.getElementsByTagName("head")[0];

            head.appendChild(node); // append to document header

            return () => { head.removeChild(node); } // return inverse
        }
        static createScriptNode(src: string): HTMLScriptElement {
            var node: HTMLScriptElement = document.createElement("script");
            node.async = true;
            node.setAttribute("src", src);
            node.type = "text/javascript";

            return node;
        }
        static hasProperty = (name: string, obj: Object) => {
            return Object.prototype.hasOwnProperty.call(obj, name);
        };
        static importScript(src: string, successFunc?: EventListener, failureFunc?: EventListener): Function {
            var node = Utilities.createScriptNode(src); // create script element

            var ffw = (event: Event) => { // define failure event listener
                bomb(event); // detonate bomb                
                if (failureFunc) { failureFunc(event); } // call custom failure event listener
            };
            var sfw = (event: Event) => { // define success event listener
                bomb(event); // detonate bomb
                if (successFunc) { successFunc(event); } // call custom success event listener
            };
            var bomb = (event: Event) => { // set us up the bomb
                invertLoad();  // remove load event
                invertError(); // remove error event                
                invertAppend(); // remove script
            };

            var invertError = Utilities.addEvent(node, "error", ffw); // add error event to node; save a function that removes the error event
            var invertLoad = Utilities.addEvent(node, "load", sfw); // add load event to node; save a function that removes the load event
            var invertAppend = Utilities.appendScriptNode(node); // append element to doc head; save a function that removes the script

            return invertAppend; // return a function that removes the script
        }
    }

    // Initialize Utilities
    (() => {
        if (window.addEventListener) {
            Utilities.addEvent = (element: Element, name: string, func: EventListener) => {
                element.addEventListener(name, func, false);

                return () => { element.removeEventListener(name, func, false); }; // return inverse
            };
        }
    })();

    export class ScriptManager {
        private static m_modules: { [name: string]: Module } = {
            "exports": new Module("exports", null, function (mod) { return mod["exports"]; }),
            "module": new Module("module", null, function (mod) { return mod; }),
            "require": new Module("require", null, function (mod) {
                function r() {
                    return ScriptManager.require.apply(this, arguments);
                }
                r['toUrl'] = function (path) {
                    return mod.id + '/' + path;
                };
                return r;
            })
        };
        private static m_pending: Array<Module> = [];

        static define(dependencies: string[], factory: Function): any {
            var m = new Module(undefined, dependencies, factory);

            ScriptManager.m_pending.push(m);

            setTimeout(() => { ScriptManager.loadDependencies(m); }, 0);
        }
        static require(id: string): void;
        static require(dependencies: Array<string>, factoryFunc: Function): void;
        static require(arg1: any, arg2?: Function): void { // https://github.com/amdjs/amdjs-api/blob/master/require.md
            if (typeof (arg1) === "string" && !arg2) {
                return ScriptManager.getModule(arg1).exportValue; // require(id) implementation
            } else if (arg1 instanceof Array && typeof (arg2) === "function") {
                ScriptManager.define(arg1, arg2); // require(dependencies, factoryFunc) implementation
            } else {
                throw new Error("invalid require call");
            }
        }

        static exportValues() {
            var count = 0;
            var lastCount = 1;
            var i: number;
            var j: number;
            var mod: Module;
            var factory: Function;
            var args: Array<any>;
            var id, value;

            while (count != lastCount) {
                lastCount = count;
                for (i = 0; i < ScriptManager.m_pending.length; i++) {
                    mod = ScriptManager.m_pending[i];
                    if ((!mod.exportValue) && ScriptManager.checkDependencies(mod)) {
                        ScriptManager.m_pending.splice(i, 1);

                        args = [];
                        for (j = 0; j < mod.dependencies.length; j++) {
                            id = mod.dependencies[j];
                            args.push(ScriptManager.getModule(id));
                        }

                        value = mod.factory.apply(mod.exports, args);
                        mod.exportValue = value || mod.exports;
                        ++count;
                    }
                }
            }
        }
        static getModule(id) {
            if (ScriptManager.m_modules.hasOwnProperty(id)) {
                return ScriptManager.m_modules[id];
            }
        }
        static importScript(id: string, successFunc?: Function, failureFunc?: EventListener) {
            var m = new Module(id);

            ScriptManager.m_modules[id] = m;

            Utilities.importScript(id + ".js", // import module
                (event: Event) => {
                    ScriptManager.importModule(id);

                    if (successFunc) { successFunc(event); }
                }
            ); 

            console.log(ScriptManager.m_modules);
            console.log(ScriptManager.m_pending);
        }
        static loadDependencies(mod: Module): void {
            var dependencies = mod.dependencies;
            var i: number;
            var id: string;

            for (i = 0; i < dependencies.length; i++) {
                id = dependencies[i];

                // normalize relative deps
                // TODO: normalize 'dot dot' segments
                if (id.charAt(0) == '.') {
                    if (mod.id.indexOf('/') >= 0) {
                        id = mod.id.replace(/\/[^/]*$/, '/') + id;
                    } else {
                        id = '/' + id;
                    }
                    id = id.replace(/[/]\.[/]/g, '/');
                    dependencies[i] = id;
                }

                // load deps that haven't started loading yet
                if (!ScriptManager.m_modules.hasOwnProperty(id)) {
                    ScriptManager.importScript(id);
                }
            }
        }
        static checkDependencies(mod: Module): boolean {
            var dependencies = mod.dependencies || [];
            var i: number;
            var mod: Module;

            for (i = 0; i < dependencies.length; i++) {
                mod = ScriptManager.getModule(dependencies[i]);
                // if the dependency doesn't exist, it's not ready
                if (!mod) { return false; }
                // if the dependency already exported something, it's ready
                if (mod.exportValue) { continue; }
                // else it's not ready
                return false;
            }

            return true;
        }

        private static importModule(id: string) {
            var isAnon: boolean;
            var mod: Module;

            while ((mod = ScriptManager.m_pending.pop())) {
                if ((!mod.id) || (mod.id == id)) {
                    isAnon = false;
                    mod.id = id;
                }

                if (!ScriptManager.getModule(mod.id)) {
                    ScriptManager.m_modules[mod.id] = mod;
                }
            }
        }
    }

    // Initialize ScriptManager
    (() => {
    })();
}

((global, undefined) => {
    global["define"] = ktw.ScriptManager.define;

    //ktw.ScriptManager.importScript("../A/dummy");
    ktw.ScriptManager.importScript("../B/child", (event: Event) => {
        var t = ktw.ScriptManager.getModule("../B/child");
        console.log(t.exportValue);
    });
})(this, undefined);