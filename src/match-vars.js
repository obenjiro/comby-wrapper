const R = require('rambdax');
const {matchMatchHelper} = require("./match-match-helper-native");

async function matchVars(varNames, matchPattern, matches) {
    matches = [].concat.call([], matches);
    const allResult = matches.map(async (prevMatch) => {
        const matchesVars = prevMatch.vars
            .filter(v => varNames.includes(v.variable));

        const allVarsResult = matchesVars.map(async (variable) => {
            return await matchMatchHelper(matchPattern, variable);
        });

        return R.flatten(await Promise.all(allVarsResult));
    });

    return R.flatten(await Promise.all(allResult));

}

module.exports = {
    matchVars,
}