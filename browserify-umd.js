"use strict;"

var browserify  = require("browserify");
var fs = require("fs");
var glob = require("glob");
var Umd = require("browserify-umdify");
var util = require("util");

var packageJson = require("./package.json");
var dependencies = Object.keys(packageJson && packageJson.dependencies || {});
var distOutFileUnversioned = "./dist/lib/umd.js";
var distOutUnversioned = fs.createWriteStream(distOutFileUnversioned, { encoding: "utf-8", flags: "w"})

var libs = browserify({
		extensions: [".js", ".json"],
	})
	.require(dependencies)
	.bundle()
	.pipe(new Umd())
	.pipe(fs.createWriteStream("./dist/lib/lib.js", { encoding: "utf-8", flags: "w"}));

var bundled = browserify({
		extensions: [".js", ".json"],
	})
	.require("./dist/lib/core/Main.js", { expose: "game-board" })
	.external(dependencies)
	.bundle()
	.pipe(new Umd());

bundled.pipe(distOutUnversioned);
