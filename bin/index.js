#!/usr/bin/env node
const argv = require('optimist').argv;
const chalk = require('chalk');
const spearhook = require('../index');

async function exec() {
    try {
        const config = await spearhook.loadConfig();
        const spearhookConfigs = Array.isArray(config.default) ? config.default : [config.default];

        if (argv.w) {
            console.log(chalk.yellow('Watching for changes. Use CTRL-C to exit.'));
        }

        spearhookConfigs.forEach(conf => {
            // Always perform an initial execution phase
            spearhook.execute(conf, true);

            if (argv.w) {
                spearhook.watch(conf);
            }
        });
    } catch (e) {
        console.log(chalk.red(e.message));
        console.log(e.stack);
    }
}

exec();
