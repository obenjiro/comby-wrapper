#!/usr/bin/env node
const vorpal = require('vorpal')();
const fs = require('fs-extra');
const path = require('path');
const fsAutocomplete = require('vorpal-autocomplete-fs');

const COMBY_FOLDER = '.comby_rules';

const commandExistsSync = require('command-exists').sync;
if (!commandExistsSync('comby')) {
    console.log('"comby" is not installed. Install it manually from https://comby.dev/docs/get-started')
    process.exit(1);
}

vorpal
    .command('init [names...]', 'create toml file for refactoring rule')
    .alias('i')
    .action(function (args, callback) {
        args.names.forEach(name => {
            const folder = path.join(COMBY_FOLDER);
            fs.ensureDirSync(folder);

            const matchFile = path.join(folder, name + '.toml');
            fs.writeFileSync(matchFile, `[pattern]

match='''

'''

rewrite='''

'''

rule='where true'`);
        });


        callback();
    });

vorpal
    .command('dryrun <directory> <name>', 'dry run of refactor comand')
    .autocomplete(fsAutocomplete())
    .alias('d')
    .option('-x, --ext <ext>', 'Filter file extensions. Comma separated list')
    .option('-e, --exclude <folders>', 'Folders to exclude from match. Comma separated list')
    .action(function (args, callback) {
        const { ext, exclude } = args.options;
        const extraExt = ext ? `-f ${ext}` : '';
        const extraExlude = exclude ? `-exclude-dir ${exclude}` : '';
        const template = path.join(COMBY_FOLDER, args.name + '.toml');
        const command = `comby -config ${template} -d ${args.directory} -matcher .js -stats -match-newline-at-toplevel ${extraExt} ${extraExlude}`;

        this.log(command)
        try {
            const output = require('child_process').execSync(command);
            this.log(output.toString('utf-8'));
        } catch (e) {
            // ignoring error since it will be outputed by execSync
        }
        callback();
    });

vorpal
    .command('apply <directory> <name>', 'executes refactor comand')
    .autocomplete(fsAutocomplete())
    .alias('a')
    .option('-x, --ext <ext>', 'Filter file extensions. Comma separated list')
    .option('-e, --exclude <folders>', 'Folders to exclude from match. Comma separated list')
    .action(function (args, callback) {
        const { ext, exclude } = args.options;
        const extraExt = ext ? `-f ${ext}` : '';
        const extraExlude = exclude ? `-exclude-dir ${exclude}` : '';
        const template = path.join(COMBY_FOLDER, args.name + '.toml');
        const command = `comby -config ${template} -d ${args.directory} -matcher .js -in-place -stats -match-newline-at-toplevel ${extraExt} ${extraExlude}`;
        this.log(command)
        try {
            const output = require('child_process').execSync(command);
            this.log(output.toString('utf-8'));
        } catch (e) {
            // ignoring error since it will be outputed by execSync
        }
        callback();
    });

vorpal
    .delimiter('COMBY$')
    .show();

vorpal.history('comby-history');




