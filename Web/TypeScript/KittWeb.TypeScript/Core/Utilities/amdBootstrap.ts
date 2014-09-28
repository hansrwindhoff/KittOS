module KittWeb.Core.Utilities {
    interface IScript {
        node: HTMLScriptElement;
    }

    class AmdBootstrap {
        private static m_scripts: { [key: string]: IScript } = {};

        public static addEvent: (element: Element, name: string, func: EventListener) => void;
        public static removeEvent: (element: Element, name: string, func: EventListener) => void;
        public static appendScript(src: string) {
            var head: HTMLHeadElement = document.head || document.getElementsByTagName("head")[0];
            var script: IScript = { node: document.createElement("script") };
            var node = script.node;
            node.async = true;
            node.setAttribute("src", src);
            node.type = "text/javascript";

            this.addEvent(node, "error", this.onImportFailure);
            this.addEvent(node, "load", this.onImportSuccess);

            head.appendChild(node);

            this.m_scripts[<string><any>node] = script;

            console.log(this.m_scripts);
        }

        private static removeScriptEvents(event) {
            var node: Element = event.srcElement; // get element

            this.removeEvent(node, "error", this.onImportFailure); // remove error event
            this.removeEvent(node, "load", this.onImportSuccess); // remove load event
        }

        // Event Handlers
        private static onImportFailure(event) { AmdBootstrap.removeScriptEvents(event); }
        private static onImportSuccess(event) {
            AmdBootstrap.removeScriptEvents(event);
            AmdBootstrap.m_scripts[event.srcElement] 
        }
    }

    // Initialize AmdBootstrap
    (() => {
        if (window.addEventListener) {
            AmdBootstrap.addEvent = (element: Element, name: string, func: EventListener) => {
                element.addEventListener(name, func, false);
            };

            AmdBootstrap.removeEvent = (element: Element, name: string, func: EventListener) => {
                element.removeEventListener(name, func, false);
            }
        }
    })();

    AmdBootstrap.appendScript("../../RequireJs/manager.js");
}

// Main
((global, undefined) => {

})(this, undefined);