declare var define;

module KittWeb.Core {
    export class AmdUtilities {
        static addEvent: (element: Element, name: string, func: EventListener) => void;
        static removeEvent: (element: Element, name: string, func: EventListener) => void;
        static appendScriptNode(node: HTMLScriptElement) {
            var head: HTMLHeadElement = document.head || document.getElementsByTagName("head")[0];
            head.appendChild(node); // append to document header
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
            };

            AmdUtilities.removeEvent = (element: Element, name: string, func: EventListener) => {
                element.removeEventListener(name, func, false);
            }
        }
    })();

    export class AmdLoader {
        private static m_modules: { [key: string]: Function; } = {};

        static define(d: any /*ignored*/, factory: Function) { }

        static importScript(src: string, id: string, successFunc?: EventListener, failureFunc?: EventListener) {
            var defaultFailureFunc = (event) => { console.log("errored"); };
            var defaultSuccessFunc = (event) => { console.log("loaded"); };
            var eventsFunc = (node) => {
                // Error event handling
                AmdUtilities.addEvent(node, "error", (event) => {
                    defaultFailureFunc(event);

                    if (failureFunc) { failureFunc(event); }
                });
                // Load event handling
                AmdUtilities.addEvent(node, "load", (event) => {
                    defaultSuccessFunc(event);

                    if (successFunc) { successFunc(event); }
                });
            };
            
            var node = AmdUtilities.createScriptNode(src, eventsFunc);

            AmdUtilities.appendScriptNode(node);
        }
    }
}

((global, undefined) => {
    global["define"] = KittWeb.Core.AmdLoader.define;

    KittWeb.Core.AmdLoader.importScript("../../RequireJs/manager.j", "");
})(this, undefined);