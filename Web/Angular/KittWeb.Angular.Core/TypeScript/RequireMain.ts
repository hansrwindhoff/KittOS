require.config({
    baseUrl: '../js',
    paths: {
        'jquery': '../Scripts/jquery/1.11.0/jquery',
        'angular': '../Scripts/angularjs/1.2.16/angular',
        'angular-route': '../Scripts/angularjs/1.2.16/angular-route',
        'angular-resource': '../Scripts/angularjs/1.2.16/angular-resource',
        'angular-ui-bootstrap': '../Scripts/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls',
    },
    shim: {
        'jquery': { exports: 'jquery' },
        'angular': { exports: 'angular', dep: ['jquery'] },
        'angular-route': { exports: 'angular-route', deps: ['angular'] },
        'angular-resource': { exports: 'angular-resource', deps: ['angular'] },
        'angular-ui-bootstrap': { exports: 'angular-ui-bootstrap', deps: ['angular'] },
    },
});

// TypeScript declarations useful for importing angular modules
declare module 'angular' {
    var angular: ng.IAngularStatic;
    export = angular;
}
declare module 'angular-route' {
}
declare module 'angular-resource' {
}
declare module 'angular-ui-bootstrap' {
}

require(['jquery', 'angular', 'angular-route', 'angular-resource', 'angular-ui-bootstrap', 'bootstrap',
    'application', 'routes'],
    function ($: JQueryStatic, angular: ng.IAngularStatic, angularRoute, angularResource, angularUiBootstrap,
        application, routes) {
        $(function () {
            angular.bootstrap(document, ['application']);
        });
    });