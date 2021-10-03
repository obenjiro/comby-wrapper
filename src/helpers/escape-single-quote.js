function escapeSingleQuote(str) {
    return str.replace(/'/g, "\\'");
}

module.exports = {
    escapeSingleQuote,
}