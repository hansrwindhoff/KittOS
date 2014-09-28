/// <reference path="../Core/Utilities/funcDef.ts" />

module KittWeb.RequireJs {
    class Dispatcher {
        private static m_worker: Worker = (() => {
            var w = new Worker("RequireJs/manager.js");

            w.addEventListener("message", (msg) => {
                console.log("***KittWeb.RequireJs.Manager: message recieved!***");
                console.log("Type: " + msg.data.msgType);
                console.log("Contents: " + msg.data.msgContents);

                if (msg.data.msgType === "importConfigSucces") {
                    require.config(msg.data.config);
                    require(msg.data.modules);
                }
            });

            w.postMessage({ msgType: "init" });

            return w;
        })();

        static importConfig(url: string) {
            Dispatcher.m_worker.postMessage({ msgType: "importConfig", msgContents: url });
        }

        constructor() { throw new Error("Cannot create new instance: KittWeb.RequireJs.Dispatcher is static."); }
    }

    Dispatcher.importConfig("../AngularJs/loader.js");
}