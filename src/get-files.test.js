const cw = require('../comby-wrapper');

describe('getFiles method', () => {
    test('should return correct files list', async () => {
        const files = await cw.getFiles(["./fixture/simple/**/*.js"], {
            ignore: ['**/node_modules/**']
        });
    
        expect(files).toStrictEqual(["./fixture/simple/test.js", "./fixture/simple/vendor/test.js"]);
    });
})

