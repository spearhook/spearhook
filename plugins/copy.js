const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

module.exports = function reader(opts) {
    return (flowObj) => {
        const { filepath } = flowObj;

        let outputPath = './';
        if (typeof opts === 'function') {
            outputPath = opts(filepath);
        }
        else if (typeof opts === 'string') {
            outputPath = opts;
        }

        const outputDir = path.dirname(outputPath);

        return new Promise((resolve, reject) => {
            const copy = () => {
                const read = fs.createReadStream(filepath);
                read.on('error', reject);

                const writer = fs.createWriteStream(outputPath);
                writer.on('error', reject);
                writer.on("close", resolve);

                read.pipe(writer);
            }

            // Ensure the directory exists
            if (!fs.existsSync(outputDir)) {
                mkdirp(outputDir, (err) => {
                    if (err) {
                        return reject(err);
                    }

                    copy();
                });
            } else {
                copy();
            }
        });
    };
};
