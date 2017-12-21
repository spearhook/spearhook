const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

module.exports = function writer(opts) {
    return (flowObj) => {
        const { conf, filepath, result } = flowObj;

        const options = Object.assign({
            path: './'
        }, opts);

        const outputPath = typeof options.resolve === 'function' ? options.resolve(filepath) : options.path;
        const outputDir = path.dirname(outputPath);

        return new Promise((resolve, reject) => {
            const write = () => {
                fs.writeFile(outputPath, result, (err) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve();
                });
            };

            // Ensure the directory exists
            if (!fs.existsSync(outputDir)) {
                mkdirp(outputDir, (err) => {
                    if (err) {
                        return reject(err);
                    }

                    write();
                });
            } else {
                write();
            }
        });
    };
};
