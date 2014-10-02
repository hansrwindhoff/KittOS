declare var define;

module KittWeb.Core {
    export class AmdModule {
        dependencies:string[];
        factoryFunc: Function;

        constructor(dependencies: string[], factoryFunc: Function) {
            this.dependencies = dependencies;
            this.factoryFunc = factoryFunc;
        }
    }
    export class AmdUtilities {
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
    }

    // Initialize AmdUtilities
    (() => {
        if (window.addEventListener) {
            AmdUtilities.addEvent = (element: Element, name: string, func: EventListener) => {
                element.addEventListener(name, func, false);

                return () => { element.removeEventListener(name, func, false); }; // return inverse
            };
        }
    })();

    export class AmdLoader {
        static pendingModules = new Array<AmdModule>();

        static define(dependencies: string[], factory: Function) {
            AmdLoader.pendingModules.push(new AmdModule(dependencies, factory));
        }
        static importScript(src: string, successFunc?: EventListener, failureFunc?: EventListener): Function {
            var node = AmdUtilities.createScriptNode(src); // create script element

            var ffw = (event: Event) => { // define failure event listener
                bomb(event); // detonate bomb
                invertAppend(); // remove script
                if (failureFunc) { failureFunc(event); } // call custom failure event listener
            };
            var sfw = (event: Event) => { // define success event listener
                bomb(event); // detonate bomb
                if (successFunc) { successFunc(event); } // call custom success event listener
            };
            var bomb = (event: Event) => { // set us up the bomb
                invertError(); // remove error event
                invertLoad();  // remove load event
            };

            var invertError = AmdUtilities.addEvent(node, "error", ffw); // add error event to node; save a function that removes the error event
            var invertLoad = AmdUtilities.addEvent(node, "load", sfw); // add load event to node; save a function that removes the load event
            var invertAppend = AmdUtilities.appendScriptNode(node); // append element to doc head; save a function that removes the script

            return invertAppend; // return a function that removes the script
        }
    }
}

((global, undefined) => {
    global["define"] = KittWeb.Core.AmdLoader.define;

    KittWeb.Core.AmdLoader.importScript("Core/Utilities/jsTypes.js");         
})(this, undefined);