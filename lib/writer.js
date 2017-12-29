const path = require('path');
const vfs = require('vinyl-fs');

module.exports = function writer(resolver) {
    return vfs.dest((file) => {
        const filepath = typeof resolver === 'function' ? resolver(file.path) : resolver;

        file.basename = path.basename(filepath);

        return path.dirname(filepath);
    });
};
