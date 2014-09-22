"use strict";

var gulp = require("gulp");
var flatten = require("gulp-flatten");
var ts = require("gulp-typescript");
var minimist = require("minimist");

// Command line options
var knownOptions = {
    string: "env",
    default: { env: process.env.NODE_ENV || "debug" }
};
var options = minimist(process.argv.slice(2), knownOptions);

var locations = {    
    buildDir: "bin/" + (function() {
        if(options.env === "debug") { return "Debug"; }
        if(options.env === "release") { return "Release"; }
    })(),
    sourceDirs: [
        // Include
        "../KittWeb.Angular.Core/**/*.d.ts",
        "Scripts/**/*.d.ts",
        "TypeScript/**/*.ts",

        // Exclude
        "!../KittWeb.Angular.Core/node_modules{,/**}"
    ]
}

// TypeScript compiler settings
var tsProj = ts.createProject({
    declarationFiles: true,
    module: "amd",
    noExternalResolve: true,
    target: "ES5"
});

// Build TypeScript files into .d.ts and .js
gulp.task("ts", function (cb) {
    var tsResult = gulp
        .src(locations.sourceDirs)
        .pipe(flatten())
        .pipe(ts(kwAngularTSProj));

    tsResult.dts.pipe(gulp.dest(locations.buildDir));
    return tsResult.js.pipe(gulp.dest(locations.buildDir));
});

// Default Task
gulp.task("default", ["ts"]);