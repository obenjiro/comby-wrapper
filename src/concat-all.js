const R = require('rambdax');

module.exports = {
    concatAll: async (asyncMethodArrays, matches) => {
        const all = await Promise.all(
            asyncMethodArrays.map(asyncMethodArray => asyncMethodArray(matches))
        );
        return R.flatten(all);
    }
}