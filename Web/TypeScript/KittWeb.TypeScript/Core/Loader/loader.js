var KittWeb;
(function (KittWeb) {
    (function (Core) {
        var AmdUtilities = (function () {
            function AmdUtilities() {
            }
            AmdUtilities.appendScriptNode = function (node) {
                var head = document.head || document.getElementsByTagName("head")[0];

                head.appendChild(node); // append to document header

                return function () {
                    head.removeChild(node);
                };
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
                var aEF = function (node) {
                    var ffw = function (event) {
                        bomb(event); // detonate bomb
                        invertAppend(); // remove script
                        failureFunc(event); // call custom failure func
                    };
                    var sfw = function (event) {
                        bomb(event); // detonate bomb
                        successFunc(event); // call custom success func
                    };
                    var bomb = function (event) {
                        invertError(); // remove error event
                        invertLoad(); // remove load event
                    };

                    var invertError = AmdUtilities.addEvent(node, "error", ffw);
                    var invertLoad = AmdUtilities.addEvent(node, "load", sfw);
                };

                var node = AmdUtilities.createScriptNode(src, aEF);
                var invertAppend = AmdUtilities.appendScriptNode(node);

                return invertAppend;
            };
            return AmdLoader;
        })();
        Core.AmdLoader = AmdLoader;
    })(KittWeb.Core || (KittWeb.Core = {}));
    var Core = KittWeb.Core;
})(KittWeb || (KittWeb = {}));

(function (global, undefined) {
    global["define"] = KittWeb.Core.AmdLoader.define; // TEMPORARY HACK

    KittWeb.Core.AmdLoader.importScript("manager.j", function () {
        console.log("import succeeded");
    }, function () {
        console.log("import failed");
    });
})(this, undefined);
//# sourceMappingURL=loader.js.map
