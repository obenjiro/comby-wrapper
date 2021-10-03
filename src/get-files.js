const glob = require("fast-glob");

async function getFiles(globPatterns, globOptions) {
    return glob(globPatterns, globOptions);
}

module.exports = {
    getFiles,
}