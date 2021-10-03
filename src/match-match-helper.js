const R = require('rambdax');
const {escapeSingleQuote} = require("./helpers/escape-single-quote");
const {parseNdjson} = require("./helpers/parse-ndjson");
const {normalizeMatchVars} = require("./helpers/normalizeMatchVars");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function matchMatchHelper(matchPattern, prevMatch) {
    const command = `echo $'${prevMatch.matched}' | comby $'${escapeSingleQuote(matchPattern)}' '' -stdin -matcher .js -match-newline-at-toplevel -match-only -json-lines`;

    const startOffset = prevMatch.range.start.offset;

    try {
        const { stdout } = await exec(command);
        const data = await parseNdjson(stdout.toString('utf8'));
        return R.chain((d) => d.matches.map(i => {
            return normalizeMatchVars({
                ...i,
                range: {
                    start: {
                        ...i.range.start,
                        offset: i.range.start.offset + startOffset
                    },
                    end: {
                        ...i.range.end,
                        offset: i.range.end.offset + startOffset
                    }
                },
                uri: prevMatch.uri,
                pattern: matchPattern
            }, matchPattern, prevMatch.uri, startOffset);
        }), data);
    } catch (e) {
        // ignoring error since it will be outputted by execSync
        console.log(e);
        return null;
    }
}

module.exports = {
    matchMatchHelper,
}