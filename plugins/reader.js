const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

module.exports = function reader(opts) {
    return (flowObj) => {
        const { conf, filepath } = flowObj;

        const options = Object.assign({
            encoding: 'utf8'
        }, opts);

        return new Promise((resolve, reject) => {
            fs.readFile(filepath, options.encoding, (err, data) => {
                if (err) {
                    return reject(err);
                }

                resolve({
                    result: data,
                    conf,
                    filepath
                });
            });
        });
    };
};
