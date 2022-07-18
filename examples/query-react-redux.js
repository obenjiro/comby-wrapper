const CW = require('../comby-wrapper');
const R = require('rambdax');

async function main() {
    const files = await CW.getFiles(["./examples/test_react/**/*.js"], {
        ignore: ['**/node_modules/**']
    });

    // reducers
    const result1 = await R.pipedAsync(
        files,
        CW.match(`export default (state = :[initialstate], action) => {:[body]}`),
        CW.match(`case :[[rname]]:`),
        CW.selectVars('rname'),
        R.pluck('matched'),
        R.uniq,
        R.sortBy(R.identity)
    );
    console.log('\n== Reducers ===')
    console.log(CW.toYamlString(result1));

    // actions
    const result2 = await R.pipedAsync(
        files,
        CW.match(`const :[[cname]] = ':[[cname]]';`),
        CW.selectVars('cname'),
        R.pluck('matched'),
        R.uniq,
        R.sortBy(R.identity)
    );

    console.log('\n== Actions ===')
    console.log(CW.toYamlString(result2));

    // components
    const result3 = await R.pipedAsync(
        files,
        CW.concatAll([
            CW.match(`const :[[cname]] = props => {:[hole]}`),
            CW.match(`class :[[cname]] extends React.Component {:[hole]}`)
        ]),
        CW.selectVars('cname'),
        R.pluck('matched'),
        R.uniq,
        R.sortBy(R.identity)
    )

    console.log('\n=== Cmps ===')
    console.log(CW.toYamlString(result3));
}

main();
