const chalk = require('chalk');

module.exports = function flow(filepath, conf, initialRun = false) {
    if (conf.plugins) {
        // Flow file/conf through all plugins
        return conf.plugins.reduce((previous, current) => {
            return previous.then(current).catch(err => {
                console.log(chalk.red(`ERROR: ${err.message}`));
                console.log(chalk.gray(err.stack));
            });
        }, Promise.resolve({
            conf, filepath, initialRun
        }));
    }

    return Promise.resolve();
}
