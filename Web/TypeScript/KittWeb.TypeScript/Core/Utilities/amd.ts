module KittWeb.Core.Utilities {
    export interface IModule {
        id: string;
        dependencies: string[];
        factoryFunc: Function;
    }
    export class Module implements IModule {
        id: string;
        dependencies: string[];
        factoryFunc: Function;

        constructor(id?: string, dependencies?, factoryFunc?: Function) {
            this.id = id;
            this.dependencies = dependencies;
            this.factoryFunc = factoryFunc;
        }
    }

    export class AmdLoader {
        static define(id?: string, dependencies?, factoryFunc?: Function): KittWeb.Core.Utilities.Module {
            return new Module(id, dependencies, factoryFunc);
        }
        static loadScript(id?: string) {
            var head = document.getElementsByTagName('head')[0];
            var node = document.createElement("script");
            node.setAttribute("src", "Core/Utilities/funcDef.js");
            node.type = "text/javascript";

            window.addEvent(node, "load", AmdLoader.onLoadSuccess);

            head.appendChild(node);
        }

        private static onLoadSuccess(event) {

        }
    }
}

interface Window {
    addEvent(context: any, eventName: string, func: Function);
}

((global, undefined) => {
    "use strict";

    global["addEvent"] = (() => { // Source : http://javascriptrules.com/2009/07/22/cross-browser-event-listener-with-design-patterns/
        if (window.addEventListener) {
            return (context: any, eventName: string, func: Function) => { context.addEventListener(eventName, func, false); };
        } else if (window.attachEvent) {
            return (context: any, eventName: string, func: Function) => { context.attachEvent('on' + eventName, func); };
        } else {
            return (context: any, eventName: string, func: Function) => { context['on' + eventName] = func; };
        }
    })();
    global["define"] = KittWeb.Core.Utilities.AmdLoader.define;

    KittWeb.Core.Utilities.AmdLoader.loadScript("");
})(this, undefined);