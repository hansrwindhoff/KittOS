var KittWeb;
(function (KittWeb) {
    (function (RequireJs) {
        var Dispatcher = (function () {
            function Dispatcher() {
                throw new Error("Cannot create new instance: KittWeb.RequireJs.Dispatcher is static.");
            }
            Dispatcher.bootstrap = function (url, postLoad) {
                if (typeof postLoad === "undefined") { postLoad = function () {
                }; }
                Dispatcher.m_worker.postMessage({ msgType: "load", path: "../AngularJs/loader.js" });
            };
            Dispatcher.m_worker = (function () {
                var w = new Worker("RequireJs/manager.js");

                w.addEventListener("message", function (msg) {
                    console.log(msg.data.msgContents);
                });

                w.postMessage({ msgType: "init" });

                return w;
            })();
            return Dispatcher;
        })();
    })(KittWeb.RequireJs || (KittWeb.RequireJs = {}));
    var RequireJs = KittWeb.RequireJs;
})(KittWeb || (KittWeb = {}));
//# sourceMappingURL=dispatcher.js.map
