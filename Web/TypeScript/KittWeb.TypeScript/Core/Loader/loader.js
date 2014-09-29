var KittWeb;
(function (KittWeb) {
    (function (Core) {
        var AmdUtilities = (function () {
            function AmdUtilities() {
            }
            AmdUtilities.appendScriptNode = function (node) {
                var head = document.head || document.getElementsByTagName("head")[0];
                head.appendChild(node); // append to document header
            };
            AmdUtilities.createScriptNode = function (src, addEventsFunc) {
                var node = document.createElement("script");
                node.async = true;
                node.setAttribute("src", src);
                node.type = "text/javascript";

                addEventsFunc(node); // add events to script node

                return node;
            };
            return AmdUtilities;
        })();
        Core.AmdUtilities = AmdUtilities;

        // Initialize AmdUtilities
        (function () {
            if (window.addEventListener) {
                AmdUtilities.addEvent = function (element, name, func) {
                    element.addEventListener(name, func, false);
                };

                AmdUtilities.removeEvent = function (element, name, func) {
                    element.removeEventListener(name, func, false);
                };
            }
        })();

        var AmdLoader = (function () {
            function AmdLoader() {
            }
            AmdLoader.define = function (d /*ignored*/ , factory) {
            };
            AmdLoader.importScript = function (src, successFunc, failureFunc) {
                var ff = function (event) {
                    dff(event);

                    if (failureFunc) {
                        failureFunc(event);
                    }
                };

                var dff = function (event) {
                    console.log("failure");
                    AmdUtilities.removeEvent(event.srcElement, "error", ff);
                };

                var aef = function (node) {
                    // Error event handling
                    AmdUtilities.addEvent(node, "error", ff);
                };

                var node = AmdUtilities.createScriptNode(src, aef);

                AmdUtilities.appendScriptNode(node); // append element to doc head
            };
            return AmdLoader;
        })();
        Core.AmdLoader = AmdLoader;
    })(KittWeb.Core || (KittWeb.Core = {}));
    var Core = KittWeb.Core;
})(KittWeb || (KittWeb = {}));

(function (global, undefined) {
    global["define"] = KittWeb.Core.AmdLoader.define;

    KittWeb.Core.AmdLoader.importScript("../../RequireJs/manager.s");
})(this, undefined);
//# sourceMappingURL=loader.js.map
