const fetch = require('node-fetch');

// checking local comby-sever
const HOST = 'http://127.0.0.1:3333';
fetch(`${HOST}`).then((response) => {
    if (response.status !== 404) {
        console.log('local "comby-server" is not working properly or port 3333 is used by other process')
        process.exit(1);
    }
}, () => {
    console.log('local "comby-server" is not started')
    process.exit(1);
});

const {selectVars} = require("./src/select-vars");
const {match} = require("./src/match-native");
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


