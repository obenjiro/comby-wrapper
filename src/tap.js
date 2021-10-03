const R = require('rambdax');

module.exports = {
    tap: async (callback, matches) => {
        await Promise.all(matches.map(callback));
        return matches;
    }
}