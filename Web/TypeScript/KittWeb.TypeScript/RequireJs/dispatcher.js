var KittWeb;
(function (KittWeb) {
    (function (RequireJs) {
        var Dispatcher = (function () {
            function Dispatcher() {
                throw new Error("Cannot create new instance: KittWeb.RequireJs.Dispatcher is static.");
            }
            Dispatcher.importConfig = function (url) {
                Dispatcher.m_worker.postMessage({ msgType: "importConfig", msgContents: url });
            };
            Dispatcher.m_worker = (function () {
                var w = new Worker("RequireJs/manager.js");

                w.addEventListener("message", function (msg) {
                    console.log("***KittWeb.RequireJs.Manager: message recieved!***");
                    console.log("Type: " + msg.data.msgType);
                    console.log("Contents: " + msg.data.msgContents);
                });

                w.postMessage({ msgType: "init" });

                return w;
            })();
            return Dispatcher;
        })();

        Dispatcher.importConfig("../AngularJs/loader.js");
    })(KittWeb.RequireJs || (KittWeb.RequireJs = {}));
    var RequireJs = KittWeb.RequireJs;
})(KittWeb || (KittWeb = {}));
//# sourceMappingURL=dispatcher.js.map
