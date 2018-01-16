const chalk = require('chalk');
const through2 = require('through2');
const vfs = require('vinyl-fs');

module.exports = (conf, opts) => {
    let stream = vfs.src(conf.input);

    // Since watches stream individual files that may belong to globs,
    // we have to override the basepath because vinyl-fs doesn't use
    // what we need for correct output
    stream = stream.pipe(through2.obj((file, encoding, cb) => {
        if (conf.basePath === undefined) {
            conf.basePath = file.base;
        }

        if (typeof conf.basePath === 'string') {
            file.base = conf.basePath;
        }
        else if (typeof conf.basePath === 'function') {
            file.base = conf.basePath(file);
        }

        cb(null, file);
    }));

    // Flow stream through plugins
    if (Array.isArray(conf.plugins)) {
        conf.plugins.forEach(plugin => {
            stream = stream.pipe(plugin(conf, opts));
        });
    }

    if (conf.output) {
        // Pass output to the writer
        stream = stream.pipe(vfs.dest(conf.output));

        // Pass written file stream to the logger
        stream = stream.pipe(through2.obj((file, encoding, cb) => {
            if (!file.isNull() && ((!opts.initialRun && opts.watch) || opts.verbose)) {
                const relativePath = file.path.replace(process.cwd() + '/', '');

                console.log(chalk.green(`Writing ${relativePath}`));
            }

            cb(null, file);
        }));
    }

    return stream;
};