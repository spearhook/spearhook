import chalk from 'chalk';

export default function(err, file) {
    console.log(chalk.magenta(`ERROR IN FILE:\n${file.path}`));
    console.log(chalk.red(err));
}
