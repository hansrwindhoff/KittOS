/// <reference path="../RequireJs/manager.ts" />
/// <reference path="../AngularJs/rjsConfig.ts" />
var rm = new KittWeb.RequireJs.Manager().load();
var a = new KittWeb.AngularJs.AngularConfig();

rm.setConfig = a.getConfig;
rm.load();