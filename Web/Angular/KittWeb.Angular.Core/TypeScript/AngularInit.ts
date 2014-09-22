/// <reference path="../Scripts/typings/angularjs/angular.d.ts" />

export module KittWeb.Angular.Core {
    "use strict";

    export class AngularInit implements IAngularConstants {
        private m_app: ng.IModule;

        public static $SCOPE = "$scope";

        constructor(appName: string) {
            this.m_app = angular.module(appName, []);
        }
    }

    // Angular constants
    export interface IAngularConstants { } // Interface skeleton
    export interface IAngularConstantsStatic { // Static members
        new (): IAngularConstants;
        $SCOPE: string;
    }

    export var IAngularConstants: IAngularConstantsStatic;
    export var ng: ng.IAngularStatic;
}