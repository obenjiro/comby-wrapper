const fetch = require('node-fetch');

let id = 0;

module.exports = {
    match: async function(file, matchPattern, type, cond) {
        const HOST = 'http://127.0.0.1:3333';

        const result = await fetch(`${HOST}/match`, {
            method: 'POST',
            body: JSON.stringify({
                source: file,
                match: matchPattern,
                rule: cond,
                language: type,
                id: id++
            })
        });

        const text = await result.text();

        try {
            return JSON.parse(text);
        } catch(e) {
            console.error(text);
            throw e;
        }
    }
}