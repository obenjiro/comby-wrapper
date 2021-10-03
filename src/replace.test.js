const fs = require('fs');
const cw = require('../comby-wrapper');

describe('matchVars method', () => {
    test('should return correct set of matches', async () => {
        const files = await cw.getFiles(["./fixture/replace/**/*.js"], {
            ignore: ['**/node_modules/**']
        });

        const firstFile = files[0];
        const firstFileInitalContent = fs.readFileSync(firstFile, 'utf8');

        let matches = await cw.match(`swap(:[x], :[y])`, files);
        await cw.replace(`swap(:[y], :[x])`, matches);
        await cw.flushWith(cw.flushInPlace, matches);

        expect(firstFileInitalContent).not.toEqual(fs.readFileSync(firstFile, 'utf8'));

        matches = await cw.match(`swap(:[x], :[y])`, files);
        await cw.replace(`swap(:[y], :[x])`, matches);
        await cw.flushWith(cw.flushInPlace, matches);

        expect(firstFileInitalContent).toEqual(fs.readFileSync(firstFile, 'utf8'));
    });
});

