﻿var KittWeb;
(function (KittWeb) {
    (function (Core) {
        var AmdModule = (function () {
            function AmdModule(dependencies, factoryFunc) {
                this.dependencies = dependencies;
                this.factoryFunc = factoryFunc;
            }
            return AmdModule;
        })();
        Core.AmdModule = AmdModule;
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
            AmdUtilities.createScriptNode = function (src) {
                var node = document.createElement("script");
                node.async = true;
                node.setAttribute("src", src);
                node.type = "text/javascript";

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

                    return function () {
                        element.removeEventListener(name, func, false);
                    };
                };
            }
        })();

        var AmdLoader = (function () {
            function AmdLoader() {
            }
            AmdLoader.define = function (dependencies, factory) {
                AmdLoader.pendingModules.push(new AmdModule(dependencies, factory));
            };
            AmdLoader.importScript = function (src, successFunc, failureFunc) {
                var node = AmdUtilities.createScriptNode(src);

                var ffw = function (event) {
                    bomb(event); // detonate bomb
                    invertAppend(); // remove script
                    if (failureFunc) {
                        failureFunc(event);
                    }
                };
                var sfw = function (event) {
                    bomb(event); // detonate bomb
                    if (successFunc) {
                        successFunc(event);
                    }
                };
                var bomb = function (event) {
                    invertError(); // remove error event
                    invertLoad(); // remove load event
                };

                var invertError = AmdUtilities.addEvent(node, "error", ffw);
                var invertLoad = AmdUtilities.addEvent(node, "load", sfw);
                var invertAppend = AmdUtilities.appendScriptNode(node);

                return invertAppend;
            };
            AmdLoader.pendingModules = new Array();
            return AmdLoader;
        })();
        Core.AmdLoader = AmdLoader;
    })(KittWeb.Core || (KittWeb.Core = {}));
    var Core = KittWeb.Core;
})(KittWeb || (KittWeb = {}));

(function (global, undefined) {
    global["define"] = KittWeb.Core.AmdLoader.define;

    KittWeb.Core.AmdLoader.importScript("Core/Utilities/jsTypes.js");
})(this, undefined);
//# sourceMappingURL=loader.js.map