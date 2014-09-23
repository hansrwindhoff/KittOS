/// <reference path="../Scripts/typings/angularjs/angular.d.ts" />

"use strict";

class AngularInit {
    private m_app: ng.IModule;

    public static $SCOPE = "$scope";
    public static $COOKIE_STORE = "$cookieStore";
    public static NG_COOKIES = "ngCookies";

    constructor(appName: string) {
        this.m_app = angular.module(appName, []);
    }
}

var ng: ng.IAngularStatic;

export = AngularInit;