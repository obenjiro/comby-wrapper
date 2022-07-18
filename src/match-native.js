const fs = require('fs');
const path = require('path');
const R = require('rambdax');
const {matchMatchHelper} = require("./match-match-helper-native");
const {normalizeMatchVars} = require("./helpers/normalizeMatchVars");
const cliProgress = require('./helpers/cli-progress');
const comby = require('./comby-server');

const ASYNC_LIMIT = 6;

async function match(matchPattern, sources) {
    sources = [].concat.call([], await sources);
    cliProgress.addMax(sources.length);
    if (typeof sources[0] === 'string' && fs.lstatSync(sources[0]).isFile()) {
        const resultAll = await R.mapAsyncLimit(async (source) => {
            const file = fs.readFileSync(source, 'utf-8');
            const extMap = {
                '.js': '.js',
                '.jsx': '.js',
                '.ts': '.ts',
                '.tsx': '.ts'
            };
            const type = extMap[path.extname(source)] || path.extname(source) || '.generic';
            const { matches } = await comby.match(file, matchPattern, type, 'where true');
            cliProgress.addVal(1);
            return (matches || []).map(i => {
                return normalizeMatchVars({
                    ...i,
                    uri: source,
                    pattern: matchPattern
                }, matchPattern, source)
            });
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