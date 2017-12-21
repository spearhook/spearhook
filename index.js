const chalk = require('chalk');
const chokidar = require('chokidar');
const flow = require('./lib/flow');
const glob = require('glob');
const loadConfig = require('./lib/load-config');

const watch = (conf) => {
    chokidar.watch(conf.input).on('all', (event, filepath) => {
        console.log(chalk.gray(`Processing changes to ${filepath}`));

        flow(filepath, conf);
    });
}

const execute = (conf) => {
    glob(conf.input, (err, files) => {
        if (err) {
            throw err;
        }

        files.forEach(filepath => {
            flow(filepath, conf);
        });
    });
}

module.exports = {
    loadConfig,
    execute,
    watch
}
