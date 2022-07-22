# Comby Wrapper

Wrapper around [Comby](https://github.com/comby-tools/comby). Comby is a tool for searching and changing code structure

### Quckstart

1) Install Comby Server
```bash
git clone https://github.com/obenjiro/comby-server.git
cd comby-server
docker-compose up
```

2) Install comby-wrapper and rambdax
```bash
npm init -y
npm i comby-wrapper rambdax
```

3) Create script file (script.js) and import comby-wrapper and install functional helper lib 
(I recommend you to use rambdax)
```js
const CW = require('comby-wrapper');
const R = require('rambdax');

async function main() {
    const files = await CW.getFiles(["./react_app/**/*.js"], {
        ignore: ['**/node_modules/**']
    });

    await R.pipedAsync(
        files,
        // query
        CW.match(`const :[[cname]] = props => {:[hole]}`),
        // here we preparing replacments
        CW.replaceWithSmartIndent(`class :[[cname]] extends React.Component {
            render() {
                const props = this.props;
                :[hole]
            }
        }`),
        // this command is applying all the replacments in original files
        CW.flushWith(CW.flushInPlace) 
    )
}
main();
```

5) Run script
```bash
node script.js

# or if you want to see progress bar
PROGRESS=1 node script.js
```

### Documentation

Plz read this before you start to use comby-wrapper: 
1) official comby docs https://comby.dev/docs/overview
2) official rambdax docs https://github.com/selfrefactor/rambdax#api 
3) examples folder for query and replace example
