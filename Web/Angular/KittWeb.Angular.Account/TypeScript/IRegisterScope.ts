/// <reference path="../../KittWeb.Angular.Core/TypeScript/AngularInit.ts" />

export module KittWeb.Angular.Account {
    "use strict";

    export class AccountControler {
        email: string;
        password: string;
        confirmPassword: string;

        constructor() {
            this.email = "";
            this.password = "";
            this.confirmPassword = "";
        }
    }

    export interface IRegisterScope extends ng.IScope {
        email: string;
        password: string;
        confirmPassword: string;
    }
}