const commandExistsSync = require('command-exists').sync;
if (!commandExistsSync('comby')) {
    console.log('"comby" is not installed. Install it manually from https://comby.dev/docs/get-started')
    process.exit(1);
}

const {selectVars} = require("./src/select-vars");
const {match} = require("./src/match");
const {matchVars} = require("./src/match-vars");
const {getFiles} = require('./src/get-files');
const {toYamlString} = require("./src/helpers/to-yaml-string");
const {curryAsync} = require( "./src/curry-async");
const {concatAll} = require("./src/concat-all");
const {tap} = require("./src/tap");
const {replace, replaceWithSmartIndent, flushWith, flushInPlace} = require("./src/replace");

module.exports =  {
    curryAsync: curryAsync,
    match: curryAsync(match),
    matchVars: curryAsync(matchVars),
    getFiles: curryAsync(getFiles),
    selectVars: curryAsync(selectVars),
    concatAll: curryAsync(concatAll),
    replace: curryAsync(replace),
    replaceWithSmartIndent: curryAsync(replaceWithSmartIndent),
    flushWith: curryAsync(flushWith),
    flushInPlace: flushInPlace,
    tap: curryAsync(tap),
    toYamlString
}


