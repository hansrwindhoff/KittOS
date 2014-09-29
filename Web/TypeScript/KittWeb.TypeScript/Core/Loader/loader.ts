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
        static define(d: any /*ignored*/, factory: Function) { }
        static importScript(src: string, successFunc?: EventListener, failureFunc?: EventListener) {
            var ff = (event: Event) => { // failure func
                dff(event);

                if (failureFunc) { failureFunc(event); }
            };

            var dff = (event: Event) => { // default failure func
                console.log("failure");
                AmdUtilities.removeEvent(event.srcElement, "error", ff);
            };

            var aef = (node: HTMLScriptElement) => { // add events func
                // Error event handling
                AmdUtilities.addEvent(node, "error", ff);
            };
            
            var node = AmdUtilities.createScriptNode(src, aef); // create script element

            AmdUtilities.appendScriptNode(node); // append element to doc head
        }
    }
}

((global, undefined) => {
    global["define"] = KittWeb.Core.AmdLoader.define;

    KittWeb.Core.AmdLoader.importScript("../../RequireJs/manager.s");
})(this, undefined);