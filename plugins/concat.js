const concat = require('vinyl-fs-concat');
const path = require('path');
const through2 = require('through2');

module.exports = function(filename) {
    return (conf) => {
        return concat(filename);
    }
};
