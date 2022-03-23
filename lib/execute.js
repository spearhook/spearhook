import chalk from 'chalk';
import handlerError from './handle-error.js';
import through2 from 'through2';
import vfs from 'vinyl-fs';

export default function(conf, opts) {
    let stream = vfs.src(conf.input, opts.globOpts);

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

            stream.on('spearhook:error', ({ err, file }) => {
                handlerError(err, file);
            });
        });
    }

    if (conf.output) {
        // Pass output to the writer
        stream = stream.pipe(vfs.dest(conf.output));
    }

    return stream;
};
