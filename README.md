![npm][npm-image]

# css-workflow
css-workflow with sass and Browsersync

## Information

css-workflow is a SASS & Browsersync startup script, which enables you to startup your css-development process.

## Requirements

[node.js/npm](https://nodejs.org/en/download/)

## Install
~~~
npm i css-workflow -g
~~~
## Usage
~~~
css-worflow run
~~~
this would use our default configuration, but you can specify them yourself with parameters.

### Parameters

Parameter | Info
  -------------  | -------------
  --cssRootFolder | *The root folder of your local css (scss) files*
  --cssIn | *scss file or a directory*
  --cssOut | *css file or a directory*
  --cssOutDev | *css file used for development*
  --browsersyncRootFolder | *the static root folder used by the web-proxy (browser-sync)*
  --browsersyncWatchFiles | *files which triggers a browser-sync*
  --browsersyncUpstreamHttpServer | *the upstream http Server*

### Build CSS
~~~
css-workflow build
~~~

TODO: Requires pre installed SASS! Eventuell auf node-sass wechseln oder ein Kommentar in die ReadMe setzen. 

[npm-url]: https://www.npmjs.com/package/css-workflow
[npm-image]: https://img.shields.io/npm/v/css-workflow.svg
