#!/usr/bin/env node
let shell = require('shelljs');

let cssFolder = process.env.npm_package_config_cssFolder;
let rootFolder = process.env.npm_package_config_rootFolder;
let upstreamHttpServer = process.env.npm_package_config_upstreamHttpServer;
let proxyWatchFiles  = process.env.npm_package_config_proxyWatchFiles;

shell.cd(cssFolder);
shell.exec('sass --watch hs.scss:hs_static.css', {async: true});

shell.cd(__dirname);
shell.cd(rootFolder);
shell.exec(`browser-sync start --proxy "${upstreamHttpServer}" --files "${proxyWatchFiles}" --serveStatic "."`, {async: true});