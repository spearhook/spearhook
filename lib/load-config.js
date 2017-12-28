const babel = require('../plugins/babel');
const flow = require('./flow');
const path = require('path');

module.exports = function(opts) {
    const options = Object.assign({
        configFilename: 'spearhook.config.js'
    }, opts);

    const { configFilename } = options;
    const configFilepath = path.resolve(configFilename);

    // Simple plugin to return the imported config object
    function configLoader() {
        return (flowObj) => {
            const { result } = flowObj;

            return new Promise((resolve, reject) => {
                // Temporarily override Node's require file loader.
                // This allows us to load the contents without writing to disk.
                const defaultLoader = require.extensions['.js'];
                require.extensions['.js'] = (m, filename) => {
                    if (filename === configFilepath) {
                        m._compile(result, filename);
                    } else {
                        defaultLoader(m, filename);
                    }
                };

                // Require our config
                const data = require(configFilepath);

                // Restore the default loader
                require.extensions['.js'] = defaultLoader;

                // Resolve
                resolve(data);
            });
        };
    };

    // Flow the config through a custom transpile config
    return flow(configFilepath, {
        plugins: [
            babel({
                plugins: ['babel-plugin-transform-es2015-modules-commonjs']
            }),
            configLoader()
        ]
    });
};
