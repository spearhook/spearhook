const babel = require('../plugins/babel');
const flow = require('./flow');
const path = require('path');
const writer = require('../plugins/writer');

module.exports = function(opts) {
    const options = Object.assign({
        filename: 'spearhook.config.js',

        // @todo temporary
        cacheFilename: 'spearhook.config.cache.js'
    }, opts);

    const { filename, cacheFilename } = options;

    const filepath = path.resolve(filename);
    const cachedConfigPath = path.resolve(cacheFilename);

    // Simple plugin to return the imported config object
    function configLoader() {
        return () => {
            return new Promise((resolve, reject) => {
                const data = require(cachedConfigPath);

                resolve(data);
            });
        };
    };

    // Flow the config through a custom transpile config
    return flow(filepath, {
        plugins: [
            babel({
                presets: ['@babel/preset-env']
            }),
            writer({
                path: cachedConfigPath
            }),
            configLoader()
        ]
    });
};
