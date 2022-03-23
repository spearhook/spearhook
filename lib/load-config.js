import babel from '@spearhook/plugin-babel';
import execute from './execute.js';
import path from 'path';
import through2 from 'through2';
import vfs from 'vinyl-fs';

export default function(opts) {
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

    const defaultConfig = {
        incremental: true,
        input: 'src.js',
        output: 'dist'
    }

    // Execute the stream and return the result as a promise
    return new Promise((resolve, reject) => {
        execute(conf, {}).pipe(through2.obj((file, encoding, cb) => {
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

            // Build the final config array
            const final = [];

            // Merge config object with defaults
            const pusher = (obj) => final.push(Object.assign({}, defaultConfig, obj));

            if (Array.isArray(data.default)) {
                data.default.forEach(pusher);
            } else {
                pusher(data.default);
            }

            // Restore the default loader
            require.extensions['.js'] = defaultLoader;

            // Resolve and continue
            resolve(final);
            cb();
        }));
    });
}
