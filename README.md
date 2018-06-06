![npm][npm-image]

# css-workflow
css-workflow with sass and Browsersync

## Information

css-workflow is a SASS & Browsersync startup script, which enables you to startup your css-development process.

## Requirements

[node.js/npm](https://nodejs.org/en/download/)

Compiling on Windows machines requires the [node-gyp prerequisites](https://github.com/nodejs/node-gyp#on-windows).

## Install
~~~
npm i css-workflow -g
~~~
## Usage
~~~
css-workflow
~~~
this would use our default configuration, so you have to specify some options

### Options

Option | Info
  -------------  | -------------
  --cssRootFolder | *The root folder of your local css (scss) files*
  --cssIn | *scss file*
  --cssOut | *css file(s)*
  --browsersyncRootFolder | *the static root folder used by the web-proxy (browser-sync)*
  --browsersyncWatchFiles | *files which triggers a browser-sync*
  --browsersyncUpstreamHttpServer | *the upstream http Server*

### Chrome Developer Tools

#### Requirement
Activate CSS-Sourcemaps in the Developer settings
 
#### About
You can use Chrome Workspaces to make changes directly from Chrome.
You can play with css settings in the CSS Properties Explorer, this changes aren´t saved.
To save a file simply open the scss file under Chrome (there clickable filename in the CSS Properties Explorer) and save it.

[npm-url]: https://www.npmjs.com/package/css-workflow
[npm-image]: https://img.shields.io/npm/v/css-workflow.svg
