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
    startSASS();
    startBrowserSync();
}

function arefoldersAvailable() {
    //TODO: check all folders
    //fs.access
    return true; //debug
}

function asPosixPath(path) {
    return path.replace(/\\/g, '/');
}

function startSASS() {
    let root = path.normalize(path.isAbsolute(yargs.cssRootFolder) ? yargs.cssRootFolder : `${workfolder}/${yargs.cssRootFolder}`);
    let watchFiles = `${root}/**/*.scss`;

    chokidar.watch(asPosixPath(watchFiles), {ignored: /\*\.css/}).on('change', () => {
        let inFile = path.join(root, yargs.cssIn);
        let outFiles = yargs.cssOut.map(item => {
            return path.join(root, item);
        });
        for (let outFile of outFiles) {
            let mapFile = outFile + '.map';
            console.log(inFile);
            console.log(outFile);
            console.log(mapFile);
            sass.render({
                file: inFile,
                outFile: outFile,
                sourceMap: mapFile,
            }, function (err, result) {
                if (err) console.error(err);
                fs.writeFile(outFile, result.css, err => {
                        if (err) throw err;
                        console.log(`Saved: ${outFile}`);
                    }
                );
                fs.writeFile(mapFile, result.map, err => {
                        if (err) throw err;
                        console.log(`Saved: ${mapFile}`);
                    }
                );
            })
        }
    });
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
        .options({
                cssRootFolder: {
                    default: defaultConfig.cssRootFolder,
                    describe: ''
                },
                cssIn: {
                    default: defaultConfig.cssIn,
                    describe: 'scss filename'
                },
                cssOut: {
                    default: defaultConfig.cssOut,
                    array: true,
                    describe: 'filename(s)'
                },
                browsersyncRootFolder: {
                    default: defaultConfig.browsersyncRootFolder,
                    describe: 'root folder to server static content'
                },
                browsersyncWatchFiles: {
                    default: defaultConfig.browsersyncWatchFiles,
                    describe: 'file path to watch'
                },
                browsersyncUpstreamHttpServer: {
                    default: defaultConfig.browsersyncUpstreamHttpServer,
                    describe: 'URL of the upstream server'
                }
            }
        )
        .fail(function (msg, err, yargs) {
            if (err) throw err; // preserve stack
            console.error('You broke it!');
            console.error('You should be doing', yargs.help());
            process.exit(1)
        })
        .argv;
}