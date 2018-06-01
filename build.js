#!/usr/bin/env node
let shell = require('shelljs');

let sassFolder = process.env.npm_package_config_sassWorkfolder;

shell.cd(sassFolder);
shell.exec('sass --no-cache --style compressed hs.scss hs.css');
