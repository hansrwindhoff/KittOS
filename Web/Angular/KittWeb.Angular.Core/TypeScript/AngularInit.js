/// <reference path="../Scripts/typings/angularjs/angular.d.ts" />
define(["require", "exports"], function(require, exports) {
    (function (KittWeb) {
        (function (Angular) {
            (function (Core) {
                "use strict";

                var AngularInit = (function () {
                    function AngularInit(appName) {
                        this.m_app = angular.module(appName, []);
                    }
                    AngularInit.$SCOPE = "$scope";
                    return AngularInit;
                })();
                Core.AngularInit = AngularInit;

                

                Core.IAngularConstants;
                Core.ng;
            })(Angular.Core || (Angular.Core = {}));
            var Core = Angular.Core;
        })(KittWeb.Angular || (KittWeb.Angular = {}));
        var Angular = KittWeb.Angular;
    })(exports.KittWeb || (exports.KittWeb = {}));
    var KittWeb = exports.KittWeb;
});
//# sourceMappingURL=AngularInit.js.map
