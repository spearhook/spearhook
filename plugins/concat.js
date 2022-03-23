import concat from 'vinyl-fs-concat';
import path from 'path';
import through2 from 'through2';

export default function(filename) {
    return (conf) => {
        return concat(filename);
    }
};
