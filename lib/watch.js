const chalk = require('chalk');
const chokidar = require('chokidar');
const execute = require('./execute');

module.exports = (conf, execOpts) => {
    chokidar.watch(conf.input, {
        ignoreInitial: true
    }).on('all', (event, filepath) => {
        execOpts.initialRun = false;

        const relativePath = filepath.replace(process.cwd() + '/', '');
        console.log(chalk.gray(`Processing changes to ${relativePath}`));

        // Most watches only need to take action on a single file,
        // so rather than reprocess the entire glob/stream,
        // we limit exec to that file
        if (conf.incremental) {
            const clonedConf = JSON.parse(JSON.stringify(conf));
            clonedConf.input = relativePath;
            clonedConf.plugins = conf.plugins;

            execute(clonedConf, execOpts);
        } else {
            execute(conf, execOpts);
        }
    });
};
