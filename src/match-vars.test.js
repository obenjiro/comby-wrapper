const fs = require('fs');
const cw = require('../comby-wrapper');

describe('matchVars method', () => {
    test('should return correct set of matches', async () => {
        const files = await cw.getFiles(["./fixture/**/*.js"], {
            ignore: ['**/node_modules/**']
        });

        const matches = await cw.match(`swap(:[args])`, files);
        const result = await cw.matchVars(['args'], `:[[1]], :[[2]]`, matches);

        expect(result).toEqual(expect.arrayContaining([
            expect.objectContaining({
                "matched": "x, y", 
                "pattern": ":[[1]], :[[2]]",
                "uri": expect.any(String)
            }),
            expect.objectContaining({
                "matched": "x, y", 
                "pattern": ":[[1]], :[[2]]",
                "uri": expect.any(String)
            })
        ]));
    });

    test('should return correct location of matches', async () => {
        const files = await cw.getFiles(["./fixture/simple/**/*.js"], {
            ignore: ['**/node_modules/**']
        });

        const filesContent = files.map(file => fs.readFileSync(file, 'utf8'));

        const matches = await cw.match(`swap(:[args])`, files);
        const result = await cw.matchVars(['args'], `:[[1]], :[[2]]`, matches);

        const str1 = filesContent[0].substring(
            result[0].range.start.offset,
            result[0].range.end.offset
        );
        expect(str1).toEqual('x, y');

        const str2 = filesContent[1].substring(
            result[1].range.start.offset,
            result[1].range.end.offset
        );
        expect(str2).toEqual('x, y');
    });
})