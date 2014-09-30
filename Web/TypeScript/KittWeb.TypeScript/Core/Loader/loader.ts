declare var define;

module KittWeb.Core {
    export class AmdUtilities {
        static addEvent: (element: Element, name: string, func: EventListener) => Function;
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

                var inverse = () => {
                    element.removeEventListener(name, func, false);
                };

                return inverse;
            };

            AmdUtilities.removeEvent = (element: Element, name: string, func: EventListener) => {
                element.removeEventListener(name, func, false);
            }
        }
    })();

    export class AmdLoader {
        static define(d: any /*ignored*/, factory: Function) { }
        static importScript(src: string, successFunc?: EventListener, failureFunc?: EventListener) {
            var ffw = (event: Event) => { // define failure event listener
                bomb(event);
                failureFunc(event);
            };
            var sfw = (event: Event) => { // define success event listener
                bomb(event);
                successFunc(event);
            };
            var bomb = (event: Event) => { // remove event listeners
                AmdUtilities.removeEvent(event.srcElement, "error", ffw);
                AmdUtilities.removeEvent(event.srcElement, "load", sfw);
            };
            var aEF = (node: HTMLScriptElement) => { // define add event listeners func
                AmdUtilities.addEvent(node, "error", ffw);
                AmdUtilities.addEvent(node, "load", sfw);
            };

            var node = AmdUtilities.createScriptNode(src, aEF); // create script element
            AmdUtilities.appendScriptNode(node); // append element to doc head
        }
    }
}

((global, undefined) => {
    global["define"] = KittWeb.Core.AmdLoader.define;

    KittWeb.Core.AmdLoader.importScript("../../RequireJs/manager.js",
        () => { console.log("you win"); },
        () => { console.log("you lose"); }
    );
})(this, undefined);