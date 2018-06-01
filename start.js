#!/usr/bin/env node
let defaultConfig = require(__dirname + '/defaultConfig.json');
let shell = require('shelljs');
let yargs = getYargs();

let workfolder = shell.pwd().stdout;
if (arefoldersAvailable()) {
    run();
} else {
    console.error('At least one of the configured folders didn´t exist');
    process.exitCode = 1;
}

function run() {
    if (yargs._.includes('build')) {
        startSASSBuild();
    } else if (yargs._.includes('run')) {
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
    //TODO einkommentieren
    //shell.exec(sassCmd, {async: true});
}

function startSASSBuild() {
    cdRoot();
    shell.cd(yargs.cssFolder);
    let sassBuildCmd = `sass --no-cache --style compressed ${yargs.cssPrecompilerInputFile} ${yargs.cssPrecompilerOutputFileProduction}`;
    //TODO einkommentieren
    //shell.exec(sassBuildCmd, {async: true});
}

function startBrowserSync() {
    cdRoot();
    let browsersyncCmd = `browser-sync start --proxy "${yargs.upstreamHttpServer}" --files "${yargs.browsersyncWatchFiles}" --serveStatic "."`;
    //shell.exec(browsersyncCmd, {async: true});
}


function getYargs() {
    return require('yargs')
        .usage('Usage: $0 <command> [options]')
        .command("run", "launches your development session backed by SASS & Browser-Sync", {
            rootFolder: {
                alias: 'root',
                default: defaultConfig.rootFolder
            },
            cssFolder: {
                alias: 'css',
                default: defaultConfig.cssFolder
            }, cssPrecompilerInputFile: {
                alias: 'cssIn',
                default: defaultConfig.cssPrecompilerInputFile
            }, cssPrecompilerOutputFileProduction: {
                alias: 'cssOut',
                default: defaultConfig.cssPrecompilerOutputFileProduction
            }, cssPrecompilerOutputFileDevelopment: {
                alias: 'cssOutDev',
                default: defaultConfig.cssPrecompilerOutputFileDevelopment
            }, browsersyncWatchFiles: {
                alias: 'watch',
                default: defaultConfig.browsersyncWatchFiles
            }, upstreamHttpServer: {
                alias: 'upstream',
                default: defaultConfig.upstreamHttpServer
            }
        })
        .command("build", "processes --cssIn into --cssOut", {
            rootFolder: {
                alias: 'root',
                default: ''
            }
        })
        .check(function (argv, options) {
            return (argv._.includes('run') ^ argv._.includes('build'))
        }, true)
        .fail(function (msg, err, yargs) {
            if (err) throw err; // preserve stack
            console.error('You broke it!');
            console.error('You should be doing', yargs.help());
            process.exit(1)
        })
        .demandCommand(1, 1)
        .argv;
}