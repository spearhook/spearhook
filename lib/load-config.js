import execute from './execute.js';
import path from 'path';
import through2 from 'through2';

export default function(opts) {
    const options = Object.assign({
        configFilename: 'spearhook.config.js'
    }, opts);

    const { configFilename } = options;
    const configFilepath = path.resolve(configFilename);

    const conf = {
        input: configFilepath
    };

    const defaultConfig = {
        incremental: true,
        input: 'src.js',
        output: 'dist'
    }

    // Execute the stream and return the result as a promise
    return new Promise((resolve, reject) => {
        execute(conf, {}).pipe(through2.obj((file, encoding, cb) => {
            // Require the config
            import(configFilepath).then(data => {
                // Build the final config array
                const final = [];

                // Merge config object with defaults
                const pusher = (obj) => final.push(Object.assign({}, defaultConfig, obj));

                if (Array.isArray(data.default)) {
                    data.default.forEach(pusher);
                } else {
                    pusher(data.default);
                }

                // Resolve and continue
                resolve(final);
                cb();
            });
        }));
    });
}
