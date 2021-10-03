const ndjson = require('ndjson');
const {Readable} = require("stream");

async function parseNdjson(str) {
    const result = [];
    return new Promise((resolve, reject) => {
        const readable = Readable.from([str]).pipe(ndjson.parse({strict: false}));

        readable.on("data", (row) => {
            result.push(row);
        });
        readable.on('end', () => {
            resolve(result);
        });
        readable.on('error', (error) => {
            reject(error);
        })
    })
}

module.exports = {
    parseNdjson,
}