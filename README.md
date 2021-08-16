# Comby Helper

Wrapper around CLI tool [Comby](https://github.com/comby-tools/comby). Comby is a tool for searching and changing code structure

### Quckstart

Install Comby manually https://comby.dev/docs/get-started

1) Run Comby Helper CLI
```
npx comby-helper
```

2) Inside of interactive CLI create new pattern
```
init test
```

.comby_rules/test.toml file will be created

3) Edit it
```
[pattern]

match='''swap(:[1], :[2])'''

rewrite='''swap(:[2], :[1])'''

rule='where true'
```

4) Dry run (to test rule). 

Create src folder and add test file to it (somefile.js)

```
swap(x, y)
```

Return to interactive console. First argument is a target folder. Second argument is a rule name.
```
dry-run ./src test # or d ./src test
```

5) If everything is OK - apply this rule by calling
```
apply ./src test # or a ./src test
```

Every file will be changed automatically.

### Additional Options

To filter files by extensions add -x option
```
a ./src test -x .js,.ts,.jsx,.tsx
```

To exlude folders add -e option
```
a ./src test -e vendor,node_modules,test
```

### Documentation

Plz refer to official comby docs https://comby.dev/docs/overview
