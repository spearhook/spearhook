const babel = require('@babel/core');
const through2 = require('through2');

module.exports = function(opts) {
    return () => {
        return through2.obj((file, encoding, cb) => {
            if (file.isNull()) {
                // nothing to do
                return cb(null, file);
            }

            const result = babel.transform(file.contents.toString(), opts);

            file.contents = new Buffer(result.code);

            cb(null, file);
        });
    }
};
