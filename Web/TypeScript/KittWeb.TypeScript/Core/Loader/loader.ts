declare var define;

module KittWeb.Core {
    export class AmdModule {
        private m_dependencies: string[];
        private m_factoryFunc: Function;

        get dependencies() {
            return this.m_dependencies;
        }
        get factoryFunc() {
            return this.m_factoryFunc;
        }

        constructor(dependencies: string[], factoryFunc: Function) {
            this.m_dependencies = dependencies;
            this.m_factoryFunc = factoryFunc;
        }
    }
    export class AmdUtilities {
        static addEvent: (element: Element, name: string, func: EventListener) => Function;
        static appendScriptNode(node: HTMLScriptElement): Function {
            var head: HTMLHeadElement = document.head || document.getElementsByTagName("head")[0];

            head.appendChild(node); // append to document header

            return () => { head.removeChild(node); } // return inverse
        }
        static createScriptNode(src: string, addEventsFunc: (node: HTMLScriptElement) => any): HTMLScriptElement {
            var node: HTMLScriptElement = document.createElement("script");
            node.async = true;
            node.setAttribute("src", src);
            node.type = "text/javascript";

            addEventsFunc(node); // add events to script node

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
            var aEF = (node: HTMLScriptElement) => { // define add event listeners func
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
            };

            var node = AmdUtilities.createScriptNode(src, aEF); // create script element
            var invertAppend = AmdUtilities.appendScriptNode(node); // append element to doc head; save a function that removes the script

            return invertAppend; // return a function that removes the script
        }
    }
}

((global, undefined) => {
    global["define"] = KittWeb.Core.AmdLoader.define;

    KittWeb.Core.AmdLoader.importScript("Core/Utilities/jsTypes.js");         
})(this, undefined);