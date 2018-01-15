#!/usr/bin/env node
const argv = require('optimist').argv;
const chalk = require('chalk');
const handlerError = require('../lib/handle-error');
const spearhook = require('../index');

const execOpts = {
    basePath: process.cwd(),
    initialRun: true,
    watch: argv.w,
    verbose: argv.v
};

async function exec() {
    try {
        const configs = await spearhook.loadConfig();

        if (argv.w) {
            console.log(chalk.yellow('Watching for changes. Use CTRL-C to exit.'));
        }

        configs.forEach(conf => {
            // Always perform an initial execution phase
            spearhook.execute(conf, execOpts);

            if (argv.w) {
                spearhook.watch(conf, execOpts);
            }
        });
    } catch (e) {
        handlerError(e);
    }
}

exec();
