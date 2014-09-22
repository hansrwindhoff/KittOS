/// <reference path="../../KittWeb.Angular.Core/TypeScript/AngularInit.ts" />
define(["require", "exports"], function(require, exports) {
    (function (KittWeb) {
        (function (Angular) {
            (function (Account) {
                "use strict";

                var AccountControler = (function () {
                    function AccountControler() {
                        this.email = "";
                        this.password = "";
                        this.confirmPassword = "";
                    }
                    return AccountControler;
                })();
                Account.AccountControler = AccountControler;
            })(Angular.Account || (Angular.Account = {}));
            var Account = Angular.Account;
        })(KittWeb.Angular || (KittWeb.Angular = {}));
        var Angular = KittWeb.Angular;
    })(exports.KittWeb || (exports.KittWeb = {}));
    var KittWeb = exports.KittWeb;
});
//# sourceMappingURL=IRegisterScope.js.map
