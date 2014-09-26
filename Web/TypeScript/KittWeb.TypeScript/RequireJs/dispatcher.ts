module KittWeb.RequireJs {
    class Dispatcher {
        private static m_worker: Worker = (() => {
            var w = new Worker("RequireJs/manager.js");

            w.addEventListener("message", (msg) => {
                console.log(msg.data.msgContents);
            });

            w.postMessage({ msgType: "init" });

            return w;
        })();

        static bootstrap(url: string, postLoad: Function = () => { }) {
            Dispatcher.m_worker.postMessage({ msgType: "load", path: "../AngularJs/loader.js" });
        }

        constructor() { throw new Error("Cannot create new instance: KittWeb.RequireJs.Dispatcher is static."); }
    }
}