module.exports = function flow(filepath, conf) {
    if (conf.plugins) {
        // Flow file/conf through all plugins
        return conf.plugins.reduce((previous, current) => {
            return previous.then(current).catch(err => {
                // @todo pass up the chain
                console.log(err);
            });
        }, Promise.resolve({
            filepath, conf
        }));
    }

    return Promise.resolve();
}
