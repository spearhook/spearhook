const chalk = require('chalk');

module.exports = function(err, file) {
    console.log(chalk.red(err.message));
    console.log(chalk.gray(file.path));
    console.log(err);
}
