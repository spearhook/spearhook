const babel = require('@babel/core');

module.exports = function(opts) {
    return (flowObj) => {
        const { filepath, conf } = flowObj;

        return new Promise((resolve, reject) => {
            babel.transformFile(filepath, opts, (err, result) => {
                if (err) {
                    return reject(err);
                }

                resolve({
                    result: result.code,
                    filepath,
                    conf
                });
            });
        });
    };
};
