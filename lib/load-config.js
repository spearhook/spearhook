const babel = require('../plugins/babel');
const execute = require('./execute');
const path = require('path');
const through2 = require('through2');
const vfs = require('vinyl-fs');

module.exports = (opts) => {
    const options = Object.assign({
        configFilename: 'spearhook.config.js'
    }, opts);

    const { configFilename } = options;
    const configFilepath = path.resolve(configFilename);

    const conf = {
        input: configFilepath,
        plugins: [
            babel({
                plugins: ['babel-plugin-transform-es2015-modules-commonjs']
            })
        ]
    };

    // Execute the stream and return the result as a promise
    return new Promise((resolve, reject) => {
        execute(conf).pipe(through2.obj((file, encoding, cb) => {
            // Temporarily override Node's require file loader.
            // This allows us to load the contents without writing to disk.
            const defaultLoader = require.extensions['.js'];
            require.extensions['.js'] = (m, filename) => {
                if (filename === configFilepath) {
                    m._compile(file.contents.toString(), filename);
                } else {
                    defaultLoader(m, filename);
                }
            };

            // Require our config
            const data = require(configFilepath);

            // Restore the default loader
            require.extensions['.js'] = defaultLoader;

            resolve(data);

            cb();
        }));
    });
}
