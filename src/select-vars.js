const R = require('rambdax');

module.exports = {
    selectVars: async (varNames, matches) => {
        return R.piped(
            await matches,
            R.chain(R.prop('vars')),
            R.filter(x => varNames.includes(x.variable))
        )
    }
}