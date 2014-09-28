var KittWeb;
(function (KittWeb) {
    (function (Core) {
        (function (Utilities) {
            var AmdBootstrap = (function () {
                function AmdBootstrap() {
                }
                AmdBootstrap.appendScript = function (src) {
                    var head = document.head || document.getElementsByTagName("head")[0];
                    var script = { node: document.createElement("script") };
                    var node = script.node;
                    node.async = true;
                    node.setAttribute("src", src);
                    node.type = "text/javascript";

                    this.addEvent(node, "error", this.onImportFailure);
                    this.addEvent(node, "load", this.onImportSuccess);

                    head.appendChild(node);

                    this.m_scripts[node] = script;

                    console.log(this.m_scripts);
                };

                AmdBootstrap.removeScriptEvents = function (event) {
                    var node = event.srcElement;

                    this.removeEvent(node, "error", this.onImportFailure); // remove error event
                    this.removeEvent(node, "load", this.onImportSuccess); // remove load event
                };

                // Event Handlers
                AmdBootstrap.onImportFailure = function (event) {
                    AmdBootstrap.removeScriptEvents(event);
                };
                AmdBootstrap.onImportSuccess = function (event) {
                    AmdBootstrap.removeScriptEvents(event);
                    AmdBootstrap.m_scripts[event.srcElement];
                };
                AmdBootstrap.m_scripts = {};
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

            AmdBootstrap.appendScript("../../RequireJs/manager.js");
        })(Core.Utilities || (Core.Utilities = {}));
        var Utilities = Core.Utilities;
    })(KittWeb.Core || (KittWeb.Core = {}));
    var Core = KittWeb.Core;
})(KittWeb || (KittWeb = {}));

// Main
(function (global, undefined) {
})(this, undefined);
//# sourceMappingURL=amdBootstrap.js.map
