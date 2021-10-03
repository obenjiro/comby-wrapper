const fs = require('fs');
const R = require('rambdax');
const {matchMatchHelper} = require("./match-match-helper");
const {escapeSingleQuote} = require("./helpers/escape-single-quote");
const {parseNdjson} = require("./helpers/parse-ndjson");
const {normalizeMatchVars} = require("./helpers/normalizeMatchVars");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const cliProgress = require('./helpers/cli-progress');

const ASYNC_LIMIT = 1;

async function match(matchPattern, sources) {
    sources = [].concat.call([], await sources);
    cliProgress.addMax(sources.length);
    if (typeof sources[0] === 'string' && fs.lstatSync(sources[0]).isFile()) {
        const resultAll = await R.mapAsyncLimit(async (source) => {
            const command = `comby $'${escapeSingleQuote(matchPattern)}' '' -f ${source} -matcher .js -match-newline-at-toplevel -match-only -json-lines`;
            try {
                const { stdout } = await exec(command);
                const data = await parseNdjson(stdout.toString('utf8'));
                cliProgress.addVal(1);
                return R.chain((d) => d.matches.map(i => {
                    return normalizeMatchVars({
                        ...i,
                        uri: d.uri,
                        pattern: matchPattern
                    }, matchPattern, d.uri)
                }), data);
            } catch (e) {
                // ignoring error since it will be outputed by execSync
                console.log(e);
                cliProgress.addVal(1);
                return null;
            }
        }, ASYNC_LIMIT, sources);
        cliProgress.stop();
        return R.flatten(resultAll);
    } else if (typeof sources[0] === 'object' && sources[0] !== null) {
        const resultAll = await R.mapAsyncLimit(async (source) => {
            cliProgress.addVal(1);
            return await matchMatchHelper(matchPattern, source);
        }, ASYNC_LIMIT, sources);
        cliProgress.stop();
        return R.flatten(resultAll);
    } else {
        throw new Error('Unknown source type. Expected file paths or match. Current value: sources[0]' + sources[0]);
    }
}

module.exports = {
    match,
}