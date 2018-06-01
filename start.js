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

function startSASS() {
    shell.cd(workfolder);
    shell.cd(yargs.cssFolder);
    let sassCmd = `sass --watch ${yargs.cssPrecompilerInputFile}:${yargs.cssPrecompilerOutputFileDevelopment}`;
    shell.exec(sassCmd, {async: true});
}

function startSASSBuild() {
    shell.cd(workfolder);
    shell.cd(yargs.cssFolder);
    let sassBuildCmd = `sass --no-cache --style compressed ${yargs.cssPrecompilerInputFile} ${yargs.cssPrecompilerOutputFileProduction}`;
    shell.exec(sassBuildCmd, {async: true});
}

function startBrowserSync() {
    shell.cd(workfolder);
    shell.cd(yargs.rootFolder);
    let browsersyncCmd = `browser-sync start --proxy "${yargs.upstreamHttpServer}" --files "${yargs.browsersyncWatchFiles}" --serveStatic "."`;
    shell.exec(browsersyncCmd, {async: true});
}

function getYargs() {
    return require('yargs')
        .usage('Usage: $0 <command> [options]')
        .command("run", "launches your development session backed by SASS & Browser-Sync", {
            rootFolder: { //TODO RENAME
                alias: 'root',
                default: defaultConfig.rootFolder
                //TODO Info
            },
            cssFolder: {
                alias: 'css',
                default: defaultConfig.cssFolder
                //TODO Info
            },
            cssPrecompilerInputFile: {
                alias: 'cssIn',
                default: defaultConfig.cssPrecompilerInputFile
                //TODO Info
            },
            cssPrecompilerOutputFileProduction: {
                alias: 'cssOut',
                default: defaultConfig.cssPrecompilerOutputFileProduction
                //TODO Info
            },
            cssPrecompilerOutputFileDevelopment: {
                alias: 'cssOutDev',
                default: defaultConfig.cssPrecompilerOutputFileDevelopment
                //TODO Info
            },
            browsersyncWatchFiles: {
                alias: 'watch',
                default: defaultConfig.browsersyncWatchFiles
                //TODO Info Relativ to rootFolder
            },
            upstreamHttpServer: {
                alias: 'upstream',
                default: defaultConfig.upstreamHttpServer
                //TODO Info
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