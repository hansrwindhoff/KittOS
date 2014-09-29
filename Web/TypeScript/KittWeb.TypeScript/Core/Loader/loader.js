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

            AmdLoader.importScript = function (src, id, successFunc, failureFunc) {
                var defaultFailureFunc = function (event) {
                    console.log("errored");
                };
                var defaultSuccessFunc = function (event) {
                    console.log("loaded");
                };
                var eventsFunc = function (node) {
                    // Error event handling
                    AmdUtilities.addEvent(node, "error", function (event) {
                        defaultFailureFunc(event);

                        if (failureFunc) {
                            failureFunc(event);
                        }
                    });

                    // Load event handling
                    AmdUtilities.addEvent(node, "load", function (event) {
                        defaultSuccessFunc(event);

                        if (successFunc) {
                            successFunc(event);
                        }
                    });
                };

                var node = AmdUtilities.createScriptNode(src, eventsFunc);

                AmdUtilities.appendScriptNode(node);
            };
            AmdLoader.m_modules = {};
            return AmdLoader;
        })();
        Core.AmdLoader = AmdLoader;
    })(KittWeb.Core || (KittWeb.Core = {}));
    var Core = KittWeb.Core;
})(KittWeb || (KittWeb = {}));

(function (global, undefined) {
    global["define"] = KittWeb.Core.AmdLoader.define;

    KittWeb.Core.AmdLoader.importScript("../../RequireJs/manager.j", "");
})(this, undefined);
//# sourceMappingURL=loader.js.map
