import through2 from 'through2';

export default function(interceptor) {
    return () => {
        return through2.obj((file, encoding, cb) => {
            interceptor(file, encoding, cb);
        });
    }
};
