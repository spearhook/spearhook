const chalk = require('chalk');
const chokidar = require('chokidar');
const flow = require('./lib/flow');
const glob = require('glob');
const loadConfig = require('./lib/load-config');

const watch = (conf) => {
    chokidar.watch(conf.input, {
        ignoreInitial: true
    }).on('all', (event, filepath) => {
        const relativePath = filepath.replace(process.cwd() + '/', '');
        console.log(chalk.gray(`Processing changes to ${relativePath}`));

        flow(filepath, conf);
    });
}

const execute = (conf) => {
    const files = Array.isArray(conf.input) ? conf.input : glob.sync(conf.input);

    files.forEach(filepath => {
        flow(filepath, conf, true);
    });
}

module.exports = {
    loadConfig,
    execute,
    watch
}
