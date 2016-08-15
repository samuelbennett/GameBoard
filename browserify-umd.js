"use strict;"

var browserify  = require("browserify");
var fs = require("fs");
var glob = require("glob");
var Umd = require("browserify-umdify");
var util = require("util");

var packageJson = require("./package.json");
var distOutFileUnversioned = "./dist/lib/umd.js";
var distOutUnversioned = fs.createWriteStream(distOutFileUnversioned, { encoding: "utf-8", flags: "w"})

var bundled = browserify({
		extensions: [".js", ".json"],
		debug: true
	})
	.require("./dist/lib/core/Main.js", { expose: "game-board" })
	.bundle()
	.pipe(new Umd());

bundled.pipe(distOutUnversioned);
