#!/usr/bin/env node
/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// not using the config file module as this could be run anwhere so suppress warning
process.env.SUPPRESS_NO_CONFIG_WARNING = true;

const yargs = require('yargs');
let _ = require('lodash');


const chalk = require('chalk');
console.log('');

let results = yargs
    .commandDir('./lib/cmds')
    .help()
    .example('composer archive create --inputDir .\ncomposer identity issue\ncomposer network deploy\ncomposer participant add\ncomposer transaction submit')
    .demand(1)
    .wrap(null)
    .strict()
    .epilogue('For more information on Fabric Composer: https://fabric-composer.github.io/')
    .alias('v', 'version')
    .version(function() {
        return getInfo('composer-cli')+'\n'+
          getInfo('composer-admin')+'\n'+getInfo('composer-client')+'\n'+
          getInfo('composer-common')+'\n'+getInfo('composer-runtime-hlf')+
          '\n'+getInfo('composer-connector-hlf')+'\n';
    })
    .describe('v', 'show version information')
    .command(
    {
        command: 'shell',
        aliases: ['shell', 'i'],
        desc: 'Interactive shell',
        builder: (yargs) => yargs,
        handler: (argv) => {
            console.log('Starting shell...');
            argv.thePromise = require('./shell.js').shell();
        }
    }

    )
    .argv;

if (typeof(results.thePromise) !== 'undefined'){
    results.thePromise.then( () => {
        console.log(chalk.green('\nCommand succeeded\n'));
        process.exit(0);
    }).catch((error) => {
        console.log(error+chalk.red('\nCommand failed\n'));
        process.exit(1);
    });
} else {
    process.exit(0);
}

/**
 * [getInfo description]
 * @param  {[type]} moduleName [description]
 * @return {[type]}            [description]
 */
function getInfo(moduleName){
    let pjson = require(moduleName+'/package.json');
    return _.padEnd(pjson.name,30) + ' v'+pjson.version;
}
