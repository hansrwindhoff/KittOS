/// <reference path="../Scripts/typings/angularjs/angular.d.ts" />
"use strict";
define(["require", "exports"], function(require, exports) {
    var AngularInit = (function () {
        function AngularInit(appName) {
            this.m_app = angular.module(appName, []);
        }
        AngularInit.$SCOPE = "$scope";
        AngularInit.$COOKIE_STORE = "$cookieStore";
        AngularInit.NG_COOKIES = "ngCookies";
        return AngularInit;
    })();

    var ng;

    
    return AngularInit;
});
//# sourceMappingURL=AngularInit.js.map
