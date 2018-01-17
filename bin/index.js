#!/usr/bin/env node
const argv = require('optimist').argv;
const chalk = require('chalk');
const handlerError = require('../lib/handle-error');
const merge = require('merge-stream');
const spearhook = require('../index');
const through2 = require('through2');

const maxLength = process.stdout.columns - 4;

const execOpts = {
    basePath: process.cwd(),
    initialRun: true,
    watch: argv.w,
    verbose: argv.v
};

async function exec() {
    try {
        const configs = await spearhook.loadConfig();
        const stream = merge();

        configs.forEach(conf => {
            // Always perform an initial execution phase
            stream.add(spearhook.execute(conf, execOpts));

            if (argv.w) {
                spearhook.watch(conf, execOpts, (watchStream) => {
                    watchStream.pipe(through2.obj((file, encoding, cb) => {
                        // Trim to the relative path
                        const relativePath = file.path.replace(process.cwd() + '/', '');

                        console.log(chalk.green(`Writing ${relativePath}`));

                        cb();
                    }));
                });
            }
        });

        // Log written files
        stream.pipe(through2.obj((file, encoding, cb) => {
            if (!file.isNull()) {
                // Trim to the relative path
                const relativePath = file.path.replace(process.cwd() + '/', '');

                // Format string and truncate if necessary
                let pathStr = `Writing ${relativePath}`;
                pathStr = pathStr.substring(0, maxLength) + (pathStr.length >= maxLength ? '...' : '');

                process.stdout.cursorTo(0);
                process.stdout.write(chalk.gray(pathStr));
                process.stdout.clearLine(1);
            }

            cb();
        }));

        stream.on('end', () => {
            process.stdout.cursorTo(0);
            process.stdout.write(chalk.green('Initial run completed!'));
            process.stdout.clearLine(1);
            process.stdout.write('\n');

            if (argv.w) {
                console.log(chalk.yellow('Watching for changes. Use CTRL-C to exit.'));
            }
        });
    } catch (e) {
        handlerError(e);
    }
}

exec();
