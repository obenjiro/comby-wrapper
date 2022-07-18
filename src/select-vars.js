const R = require('rambdax');

module.exports = {
    selectVars: async (varNames, matches) => {
        return R.pipedAsync(
            await matches,
            R.chain(R.prop('vars')),
            R.filter(x => x && varNames.includes(x.variable))
        )
    }
}