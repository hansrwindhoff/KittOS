declare var define;

module KittWeb.Core {
    export class AmdUtilities {
        static addEvent: (element: Element, name: string, func: EventListener) => Function;
        static removeEvent: (element: Element, name: string, func: EventListener) => void;
        static appendScriptNode(node: HTMLScriptElement): Function {
            var head: HTMLHeadElement = document.head || document.getElementsByTagName("head")[0];

            head.appendChild(node); // append to document header

            return () => { head.removeChild(node); }
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

                // return a function that'll revert this add
                return () => { element.removeEventListener(name, func, false); };
            };

            AmdUtilities.removeEvent = (element: Element, name: string, func: EventListener) => {
                element.removeEventListener(name, func, false);
            }
        }
    })();

    export class AmdLoader {
        static define(d: any, factory: Function) { } // hack to support importing of AMD based scripts; WARNING: dependencies are ignored!
        static importScript(src: string, successFunc?: EventListener, failureFunc?: EventListener): Function {
            var aEF = (node: HTMLScriptElement) => { // define add event listeners func
                var ffw = (event: Event) => { // define failure event listener
                    bomb(event); // detonate bomb
                    invertAppend(); // remove script
                    failureFunc(event); // call custom failure func
                };
                var sfw = (event: Event) => { // define success event listener
                    bomb(event); // detonate bomb
                    successFunc(event); // call custom success func
                };
                var bomb = (event: Event) => { // set us up the bomb
                    invertError(); // remove error event
                    invertLoad();  // remove load event
                };

                var invertError = AmdUtilities.addEvent(node, "error", ffw); // add error event; save a function that removes the error event
                var invertLoad = AmdUtilities.addEvent(node, "load", sfw); // add load event; save a function that removes the load event
            };

            var node = AmdUtilities.createScriptNode(src, aEF); // create script element
            var invertAppend = AmdUtilities.appendScriptNode(node); // append element to doc head; save a function that removes the script

            return invertAppend; // return a function that removes the script
        }
    }
}

((global, undefined) => {
    global["define"] = KittWeb.Core.AmdLoader.define; // TEMPORARY HACK

    KittWeb.Core.AmdLoader.importScript("manager.j",
        () => { console.log("import succeeded"); },
        () => { console.log("import failed"); }
    );
})(this, undefined);