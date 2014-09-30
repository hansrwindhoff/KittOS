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

                    // return a function that'll revert this add
                    return function () {
                        element.removeEventListener(name, func, false);
                    };
                };

                AmdUtilities.removeEvent = function (element, name, func) {
                    element.removeEventListener(name, func, false);
                };
            }
        })();

        var AmdLoader = (function () {
            function AmdLoader() {
            }
            AmdLoader.define = function (d, factory) {
            };
            AmdLoader.importScript = function (src, successFunc, failureFunc) {
                var ffw = function (event) {
                    bomb(event);
                    failureFunc(event);
                };
                var sfw = function (event) {
                    bomb(event);
                    successFunc(event);
                };
                var bomb = function (event) {
                    AmdUtilities.removeEvent(event.srcElement, "error", ffw);
                    AmdUtilities.removeEvent(event.srcElement, "load", sfw);
                };
                var aEF = function (node) {
                    AmdUtilities.addEvent(node, "error", ffw);
                    AmdUtilities.addEvent(node, "load", sfw);
                };

                var node = AmdUtilities.createScriptNode(src, aEF);
                AmdUtilities.appendScriptNode(node); // append element to doc head
            };
            return AmdLoader;
        })();
        Core.AmdLoader = AmdLoader;
    })(KittWeb.Core || (KittWeb.Core = {}));
    var Core = KittWeb.Core;
})(KittWeb || (KittWeb = {}));

(function (global, undefined) {
    global["define"] = KittWeb.Core.AmdLoader.define; // TEMPORARY HACK

    KittWeb.Core.AmdLoader.importScript("someScriptFile.js", function () {
        console.log("import succeeded");
    }, function () {
        console.log("import failed");
    });
})(this, undefined);
//# sourceMappingURL=loader.js.map
