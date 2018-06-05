#!/usr/bin/env node
let defaultConfig = require(__dirname + '/defaultConfig.json');
let shell = require('shelljs');
let bs = require('browser-sync').create();
let path = require('path');
let fs = require('fs');
let sass = require('node-sass');
let chokidar = require('chokidar');
let yargs = initYargs();


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
        // startBrowserSync();
    }
}

function arefoldersAvailable() {
    //TODO: check all folders
    return true; //debug
}

function asPosixPath(path) {
    return path.replace(/\\/g, '/');
}

function startSASS() {
    let root = path.normalize(path.isAbsolute(yargs.cssRootFolder) ? yargs.cssRootFolder : `${workfolder}/${yargs.cssRootFolder}`);
    let watchFiles = `${root}/**/*.scss`;

    chokidar.watch(asPosixPath(watchFiles), {ignored: /\*\.css/}).on('change', (event, path) => {
        console.log('changed');
        sass.render({
            file: 'd:/repositorys/GIT/website/w/WebContent/css/hs.scss',
            outFile: 'd:/repositorys/GIT/website/w/WebContent/css/hs.css',
            sourceMap: 'd:/repositorys/GIT/website/w/WebContent/css/hs.css.map', // you can set it to `true` as well, see readme
        }, function (err, result) {
            console.log(err);
            console.log(result);

            //TODO Write Files with fs
            //fs.  (result.css, 'd:/repositorys/GIT/website/w/WebContent/css/hs.css');
            //fs.  result.map, 'd:/repositorys/GIT/website/w/WebContent/css/hs.css.map');
        })

    });
    /*   shell.cd(workfolder);
       shell.cd(yargs.cssRootFolder);
       let sassCmd = `sass --watch ${yargs.cssIn}:${yargs.cssOutDev}`;
       console.log(sassCmd);
       shell.exec(sassCmd, {async: true});*/
}

function startSASSBuild() {
    shell.cd(workfolder);
    shell.cd(yargs.cssRootFolder);
    let sassBuildCmd = `sass --no-cache --style compressed ${yargs.cssIn} ${yargs.cssOut}`;
    shell.exec(sassBuildCmd, {async: true});
}

function startBrowserSync() {
    let root = path.normalize(path.isAbsolute(yargs.browsersyncRootFolder) ? yargs.browsersyncRootFolder : `${workfolder}/${yargs.browsersyncRootFolder}`);
    let watchFiles = path.normalize(`${root}/${yargs.browsersyncWatchFiles}`);
    bs.watch(watchFiles).on("change", bs.reload);
    bs.init({
        serveStatic: [root],
        proxy: yargs.browsersyncUpstreamHttpServer
    });
}

function initYargs() {
    return require('yargs')
        .usage('Usage: $0 <command> [options]')
        .command("run", "launches your development session backed by SASS & Browser-Sync", {
            cssRootFolder: {
                alias: 'cr',
                default: defaultConfig.cssRootFolder,
                describe: ''
            },
            cssIn: {
                alias: 'i',
                default: defaultConfig.cssIn,
                describe: 'scss filename'
            },
            cssOut: {
                alias: 'o',
                default: defaultConfig.cssOut,
                describe: 'css filename for production'
            },
            cssOutDev: {
                alias: 'd',
                default: defaultConfig.cssOutDev,
                describe: 'css filename for development'
            },
            browsersyncRootFolder: {
                alias: 'br',
                default: defaultConfig.browsersyncRootFolder,
                describe: 'root folder to server static content'
            },
            browsersyncWatchFiles: {
                alias: 'w',
                default: defaultConfig.browsersyncWatchFiles,
                describe: 'file path to watch'
            },
            browsersyncUpstreamHttpServer: {
                alias: 'u',
                default: defaultConfig.browsersyncUpstreamHttpServer,
                describe: 'URL of the upstream server'
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