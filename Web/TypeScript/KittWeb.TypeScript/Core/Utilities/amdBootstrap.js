var KittWeb;
(function (KittWeb) {
    (function (Core) {
        (function (Utilities) {
            var AmdBootstrap = (function () {
                function AmdBootstrap() {
                }
                AmdBootstrap.appendScript = function (src, successFunc, failureFunc) {
                    var head = document.head || document.getElementsByTagName("head")[0];
                    var node = document.createElement("script");
                    node.async = true;
                    node.setAttribute("src", src);
                    node.type = "text/javascript";

                    var script = {
                        element: node,
                        onLoadFailureFunc: failureFunc,
                        onLoadSuccessFunc: successFunc
                    };

                    this.addEvent(node, "error", this.onImportFailure);
                    this.addEvent(node, "load", this.onImportSuccess);

                    head.appendChild(node);

                    return script;
                };

                AmdBootstrap.removeScriptEvents = function (event) {
                    var node = event.srcElement;

                    this.removeEvent(node, "error", this.onImportFailure);
                    this.removeEvent(node, "load", this.onImportSuccess);
                };

                // Event Handlers
                AmdBootstrap.onImportFailure = function (event) {
                    AmdBootstrap.removeScriptEvents(event);
                };
                AmdBootstrap.onImportSuccess = function (event) {
                    AmdBootstrap.removeScriptEvents(event);
                };
                AmdBootstrap.m_scripts = {};
                AmdBootstrap.m_queue = new Array();
                return AmdBootstrap;
            })();

            // Initialize AmdBootstrap
            (function () {
                if (window.addEventListener) {
                    AmdBootstrap.addEvent = function (element, name, func) {
                        element.addEventListener(name, func, false);
                    };

                    AmdBootstrap.removeEvent = function (element, name, func) {
                        element.removeEventListener(name, func, false);
                    };
                }
            })();
        })(Core.Utilities || (Core.Utilities = {}));
        var Utilities = Core.Utilities;
    })(KittWeb.Core || (KittWeb.Core = {}));
    var Core = KittWeb.Core;
})(KittWeb || (KittWeb = {}));

// Main
(function (global, undefined) {
})(this, undefined);
//# sourceMappingURL=amdBootstrap.js.map
