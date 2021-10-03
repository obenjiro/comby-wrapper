const fs = require('fs');
const cw = require('../comby-wrapper');

describe('match method', () => {
    test('should return correct set of matches for files', async () => {
        const files = await cw.getFiles(["./fixture/simple/**/*.js"], {
            ignore: ['**/node_modules/**']
        });

        const matches = await cw.match(`swap(:[1], :[2])`, files);

        expect(matches).toEqual(expect.arrayContaining([
            expect.objectContaining({
                "matched": "swap(x, y)",
                "pattern": "swap(:[1], :[2])",
                "uri": expect.any(String)
            }),
            expect.objectContaining({
                "matched": "swap(x, y)",
                "pattern": "swap(:[1], :[2])",
                "uri": expect.any(String)
            })
        ]));
    });

    test('should return correct set of matches for files and matches', async () => {
        const files = await cw.getFiles(["./fixture/simple/**/*.js"], {
            ignore: ['**/node_modules/**']
        });

        const matches = await cw.match(`swap(:[1], :[2])`, files);
        const result = await cw.match(`(:[1], :[2])`, matches);

        expect(result).toEqual(expect.arrayContaining([
            expect.objectContaining({
                "matched": "(x, y)",
                "pattern": "(:[1], :[2])",
                "uri": expect.any(String)
            }),
            expect.objectContaining({
                "matched": "(x, y)",
                "pattern": "(:[1], :[2])",
                "uri": expect.any(String)
            })
        ]));
    });

    test('should return correct matches location for files', async () => {
        const files = await cw.getFiles(["./fixture/simple/**/*.js"], {
            ignore: ['**/node_modules/**']
        });

        const filesContent = files.map(file => fs.readFileSync(file, 'utf8'));

        const matches = await cw.match(`swap(:[1], :[2])`, files);

        const str1 = filesContent[0].substring(
            matches[0].range.start.offset,
            matches[0].range.end.offset
        );
        expect(str1).toEqual('swap(x, y)');

        const str2 = filesContent[1].substring(
            matches[1].range.start.offset,
            matches[1].range.end.offset
        );
        expect(str2).toEqual('swap(x, y)');
    });

    test('should return correct matches location for files and matches', async () => {
        const files = await cw.getFiles(["./fixture/simple/**/*.js"], {
            ignore: ['**/node_modules/**']
        });

        const filesContent = files.map(file => fs.readFileSync(file, 'utf8'));

        const matches = await cw.match(`swap(:[1], :[2])`, files);
        const result = await cw.match(`(:[1], :[2])`, matches);

        const str1 = filesContent[0].substring(
            result[0].range.start.offset,
            result[0].range.end.offset
        );
        expect(str1).toEqual('(x, y)');

        const str2 = filesContent[1].substring(
            result[1].range.start.offset,
            result[1].range.end.offset
        );
        expect(str2).toEqual('(x, y)');
    });
})