const CW = require('../comby-wrapper');
const R = require('rambdax');
const fs = require('fs');

async function main() {
    fs.writeFileSync("./examples/test_react_refactor/ArticleList.js", getFileContent(), 'utf8');

    const files = await CW.getFiles(["./examples/test_react_refactor/**/*.js"], {
        ignore: ['**/node_modules/**']
    });

    // components
    await R.pipedAsync(
        files,
        CW.match(`const :[[cname]] = props => {:[hole]}`),
        CW.replaceWithSmartIndent(`class :[[cname]] extends React.Component {
            render() {
                const props = this.props;
                :[hole]
            }
        }`),
        CW.flushWith(CW.flushInPlace)
    );
}

main();


function getFileContent() { 
    return `
import ArticlePreview from './ArticlePreview';
import ListPagination from './ListPagination';
import React from 'react';

class ArticleList extends React.Component {
    render() {
        const props = this.props;
        if (!props.articles) {
          return (
            <div className="article-preview">Loading...</div>
          );
        }
        
        if (props.articles.length === 0) {
          return (
            <div className="article-preview">
              No articles are here... yet.
            </div>
          );
        }
        
        return (
          <div>
            {
              props.articles.map(article => {
                return (
                  <ArticlePreview article={article} key={article.slug} />
                );
              })
            }
        
            <ListPagination
              pager={props.pager}
              articlesCount={props.articlesCount}
              currentPage={props.currentPage} />
          </div>
        );
    }
};

export default ArticleList;

`}
