const concat = require('vinyl-fs-concat');
const path = require('path');
const through2 = require('through2');

module.exports = function(opts) {
    return (conf) => {
        return concat(path.basename(conf.output));
    }
};
