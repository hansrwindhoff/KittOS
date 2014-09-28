module KittWeb.Core.Utilities {
    interface IScript {
        element: HTMLScriptElement;
        onLoadFailureFunc?: Function;
        onLoadSuccessFunc?: Function;
    }

    class AmdBootstrap {
        private static m_scripts: { [key: string]: IScript } = {};
        private static m_queue = new Array<() => any>();

        public static addEvent: (element: Element, name: string, func: EventListener) => void;
        public static removeEvent: (element: Element, name: string, func: EventListener) => void;
        public static appendScript(src: string, successFunc?: Function, failureFunc?: Function): IScript {
            var head: HTMLHeadElement = document.head || document.getElementsByTagName("head")[0];
            var node: HTMLScriptElement = document.createElement("script");
            node.async = true;
            node.setAttribute("src", src);
            node.type = "text/javascript";

            var script: IScript = {
                element: node,
                onLoadFailureFunc: failureFunc,
                onLoadSuccessFunc: successFunc
            };

            this.addEvent(node, "error", this.onImportFailure);
            this.addEvent(node, "load", this.onImportSuccess);

            head.appendChild(node);

            return script;
        }

        private static removeScriptEvents(event) {
            var node: Element = event.srcElement;

            this.removeEvent(node, "error", this.onImportFailure);
            this.removeEvent(node, "load", this.onImportSuccess);
        }

        // Event Handlers
        private static onImportFailure(event) { AmdBootstrap.removeScriptEvents(event); }
        private static onImportSuccess(event) { AmdBootstrap.removeScriptEvents(event); }
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
}

// Main
((global, undefined) => {

})(this, undefined);