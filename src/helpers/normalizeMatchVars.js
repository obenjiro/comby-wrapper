const unescapeJs = require('unescape-js');

function normalizeMatchVars(match, pattern, uri, startOffset = 0) {
    const result = {
        ...match,
        vars: match.environment
            .filter((env) => env.variable)
            .map(v => ({
                ...v,
                uri,
                pattern,
                range: {
                    start: {
                        ...v.range.start,
                        offset: v.range.start.offset + startOffset
                    },
                    end: {
                        ...v.range.end,
                        offset: v.range.end.offset + startOffset
                    }
                },
                matched: unescapeJs(v.value)
            }))
    };
    delete result.environment;
    return result;
}

module.exports = {
    normalizeMatchVars
} 