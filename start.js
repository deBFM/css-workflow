#!/usr/bin/env node
let shell = require('shelljs');
let yargs = require('yargs')
    .usage('Usage: $0 <command> [options]')
    //.config(defaultConfig)
    .command("start", "launches your development session backed by SASS & Browser-Sync", {
        rootFolder: {
            alias: 'root',
            default:''
        }
    })
    .command("build", "processes --cssPrecompilerInputFile into --cssPrecompilerOutputFileProduction", {
        rootFolder: {
            alias: 'root',
            default:''
        }
    })
    .demandCommand(1,1)
    .epilogue('by Dennis Kronbügel 2018')
    .argv;

let workfolder = shell.pwd().stdout;
if (arefoldersAvailable()) {
    run();
} else {
    console.error('At least one of the configured folders didn´t exist')
    process.exitCode = 1;
}

function run() {
    if (yargs.build) {
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
    shell.cd(workfolder);
    shell.cd(yargs.rootFolder);
}

function startSASS() {
    cdRoot();
    shell.cd(yargs.cssFolder);
    let sassCmd = `sass --watch ${yargs.cssPrecompilerInputFile}:${yargs.cssPrecompilerOutputFileDevelopment}`;
    //shell.exec(sassCmd, {async: true});
}

function startSASSBuild() {
    cdRoot();
    shell.cd(yargs.cssFolder);
    let sassBuildCmd = `sass --no-cache --style compressed ${yargs.cssPrecompilerInputFile} ${yargs.cssPrecompilerOutputFileProduction}`;
    //shell.exec(sassBuildCmd, {async: true});
}

function startBrowserSync() {
    cdRoot();
    let browsersyncCmd = `browser-sync start --proxy "${yargs.upstreamHttpServer}" --files "${yargs.browsersyncWatchFiles}" --serveStatic "."`;
    //shell.exec(browsersyncCmd, {async: true});
}