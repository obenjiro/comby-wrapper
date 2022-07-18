const {normalizeMatchVars} = require("./helpers/normalizeMatchVars");
const comby = require('./comby-server');

async function matchMatchHelper(matchPattern, prevMatch) {
    const startOffset = prevMatch.range.start.offset;
    const { matches } = await comby.match(prevMatch.matched, matchPattern, '.generic', 'where true');
    return (matches || []).map(i => {
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
    });
}

module.exports = {
    matchMatchHelper,
}