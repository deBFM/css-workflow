#!/usr/bin/env node
let shell = require('shelljs');
let nconf = require('nconf');

//Configure nconf
nconf.argv().file(__dirname + '/config.json');
let workfolder = shell.pwd().stdout;

if (arefoldersAvailable()) {
    process();
} else {
    console.error('At least one of the configured folders didn´t exist')
    process.exitCode = 1;
}

function process() {
    if (nconf.get('build')) {
        startSASSBuild();
    } else {
        startSASS();
        startBrowserSync();
    }
}

function arefoldersAvailable() {
    //TODO: check all folders
    return true; //debug
}

function cdRoot() {
    console.log("current location before root() is: " + shell.pwd().stdout);
    shell.cd(workfolder);
    shell.cd(nconf.get('rootFolder'));
    console.log("current location is: " + shell.pwd().stdout);
}

function startSASS() {
    cdRoot();
    shell.cd(nconf.get('cssFolder'));
    let sassCmd = `sass --watch ${nconf.get('cssPrecompilerInputFile')}:${nconf.get('cssPrecompilerOutputFileDevelopment')}`;
    console.log("sassCmd: " + sassCmd)
    //shell.exec(sassCmd, {async: true});
}

function startSASSBuild() {
    cdRoot();
    shell.cd(nconf.get('cssFolder'));
    let sassBuildCmd = `sass --no-cache --style compressed ${nconf.get('cssPrecompilerInputFile')} ${nconf.get('cssPrecompilerOutputFileProduction')}`;
    console.log("sassBuildCmd: " + sassBuildCmd)
    shell.exec(sassBuildCmd, {async: true});
}

function startBrowserSync() {
    cdRoot();
    let browsersyncCmd = `browser-sync start --proxy "${nconf.get('upstreamHttpServer')}" --files "${nconf.get('browsersyncWatchFiles')}" --serveStatic "."`;
    console.log("browsersyncCmd: " + browsersyncCmd);
    //shell.exec(browsersyncCmd, {async: true});
}

