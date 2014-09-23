/// <reference path="../Scripts/typings/requirejs/require.d.ts" />
/// <reference path="../../../TypeScript/KittWeb.TypeScript.Core/Core.ts" />
var Core;
(function (Core) {
    var RequireMain = (function () {
        function RequireMain() {
            this.paths = new Core.DictionaryTest();
        }
        return RequireMain;
    })();
    Core.RequireMain = RequireMain;
})(Core || (Core = {}));
require.config({
    baseUrl: '../js',
    paths: {
        'jquery': '../Scripts/jquery/1.11.0/jquery',
        'angular': '../Scripts/angularjs/1.2.16/angular',
        'angular-route': '../Scripts/angularjs/1.2.16/angular-route',
        'angular-resource': '../Scripts/angularjs/1.2.16/angular-resource',
        'angular-ui-bootstrap': '../Scripts/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls'
    },
    shim: {
        'jquery': { exports: 'jquery' },
        'angular': { exports: 'angular', dep: ['jquery'] },
        'angular-route': { exports: 'angular-route', deps: ['angular'] },
        'angular-resource': { exports: 'angular-resource', deps: ['angular'] },
        'angular-ui-bootstrap': { exports: 'angular-ui-bootstrap', deps: ['angular'] }
    }
});


require([
    'jquery', 'angular', 'angular-route', 'angular-resource', 'angular-ui-bootstrap', 'bootstrap',
    'application', 'routes'], function ($, angular, angularRoute, angularResource, angularUiBootstrap, application, routes) {
    $(function () {
        angular.bootstrap(document, ['application']);
    });
});
//# sourceMappingURL=RequireMain.js.map
