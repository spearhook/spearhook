const chalk = require('chalk');
const chokidar = require('chokidar');
const execute = require('./execute');

module.exports = (conf) => {
    chokidar.watch(conf.input, {
        ignoreInitial: true
    }).on('all', (event, filepath) => {
        const relativePath = filepath.replace(process.cwd() + '/', '');
        console.log(chalk.gray(`Processing changes to ${relativePath}`));

        execute(conf);
    });
};
