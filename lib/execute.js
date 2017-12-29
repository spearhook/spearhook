const merge = require('merge-stream');
const vfs = require('vinyl-fs');
const writer = require('./writer');

module.exports = (conf, initialRun = false) => {
    // Merge all streams. Allows multiple VFS streams since
    // they combine arrays of glob patterns
    let stream = merge();
    if (Array.isArray(conf.input)) {
        conf.input.forEach(input => stream.add(vfs.src(input)));
    } else {
        stream.add(vfs.src(conf.input));
    }

    // Flow stream through plugins
    if (Array.isArray(conf.plugins)) {
        conf.plugins.forEach(plugin => {
            stream = stream.pipe(plugin(conf, {
                initialRun
            }));
        });
    }

    // Pass output to the writer
    if (conf.output) {
        stream = stream.pipe(writer(conf.output));
    }

    return stream;
};
