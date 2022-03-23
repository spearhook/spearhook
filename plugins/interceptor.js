import through2 from 'through2';

module.exports = function(interceptor) {
    return () => {
        return through2.obj((file, encoding, cb) => {
            interceptor(file, encoding, cb);
        });
    }
};
