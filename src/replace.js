const {selectVars} = require('./select-vars');
const fs = require('fs');
const MagicString = require('magic-string');
const dedent = require('dedent-js');

module.exports = {
    replaceWithSmartIndent: async function(rawTargetPattern, matches) {
        const targetPattern = dedent(rawTargetPattern);
        return Promise.all(matches.map(async (match) => {
            const ms = getMagicStringByFilename(match.uri, targetPattern);
            const allMatches = matchAll(/\:\[\[?([^\]]+)\]\]?/gi, targetPattern);
    
            await Promise.all(allMatches.map(async (patternMatch) => {
                const [pattern, name] = patternMatch;
                const startIndex = patternMatch.index;
                const endIndex = startIndex + pattern.length;

                // get last newline (with spaces) indent
                const before = targetPattern.slice(0, startIndex);
                const [,beforeLastIndent] = before.match(/\n([ \t]+)[^\n]*\n?$/) || [,''];
    
                const vars = await selectVars([name], [match]);

                // indent everyline except for the first one
                let sourceMatched = dedent(vars[0].matched);
                if (sourceMatched.indexOf('\n') !== -1) {
                    sourceMatched = sourceMatched
                        .split('\n')
                        .map((line, index) => {
                            return index !== 0 ? ' '.repeat(beforeLastIndent.length) + line: line;
                        })
                        .join('\n');
                }

                ms.overwrite(startIndex, endIndex, sourceMatched);
            }));

            return match;
        }));
    },

    replace: async function(targetPattern, matches) {
        return Promise.all(matches.map(async (match) => {
            const ms = getMagicStringByFilename(match.uri, targetPattern);
            const allMatches = matchAll(/\:\[\[?([^\]]+)\]\]?/gi, targetPattern);
    
            await Promise.all(allMatches.map(async (patternMatch) => {
                const [pattern, name] = patternMatch;
                const startIndex = patternMatch.index;
                const endIndex = startIndex + pattern.length;
    
                const vars = await selectVars([name], [match]);
                    
                ms.overwrite(startIndex, endIndex, vars[0].matched);
            }));

            return match;
        }));
    },

    flushWith: async function(algorithm, matches) {
        await algorithm(matches, getMagicStringByFilename);
        msHash = {};
        return null;
    },

    flushInPlace: async function(matches, getMagicStringByFilename) {    
        await Promise.all(matches.map(async (match) => {
            const ms = getMagicStringByFilename(match.uri);
            const fileContent = fs.readFileSync(match.uri, 'utf8');
            const fileMs = new MagicString(fileContent);
    
            fileMs.overwrite(match.range.start.offset, match.range.end.offset, ms.toString());
    
            fs.writeFileSync(match.uri, fileMs.toString(), 'utf8');
        }));
    }
}

function matchAll(re, str) {
    let match
    const matches = []
  
    while (match = re.exec(str)) {
      matches.push(match)
    }
  
    return matches
}

let msHash = {};
function getMagicStringByFilename(filename, content) {
    if (!msHash[filename]) {
        msHash[filename] = new MagicString(content);
    }
    return msHash[filename];
}