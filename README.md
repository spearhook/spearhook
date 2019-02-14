# Spearhook

A minimal, pluggable, non-bundling web app pipeline.

## Why non-bundling?

Some projects need an easy pipeline for AMD or other fully-split formats, without having to fight against a bundler.

## Usage

Install, via yarn `yarn add --dev @spearhook/spearhook` or NPM `npm install --save-dev @spearhook/spearhook`.

Add a `spearhook.config.js` file to the root of your project.

Configure a list of files and plugins to flow them through:

```js
export default {
    input: 'src/app.js',
    plugins: [
        babel({
            presets: ['@babel/preset-env']
        }),
        writer((filepath) => filepath.replace('src', 'dist'))
    ]
};
```

Run `spearhook`.

## Writing Plugins

Create a new javascript file which exports a module.

Each plugin has three core pieces:

1. The initialization function, in which custom configuration options are provided.
2. A stream execution function, which returns a stream transformer.
3. File contents/path actor.

```js
const through2 = require('through2');

module.exports = function(opts) {
    return () => through2.obj(function(file, encoding, cb) {
        // transform file.contents, act on file.path, etc

        // emit errors with this.emit('spearhook.error', ...);

        cb(null, file);
    });
};
```

The `file` argument is a [Vinyl](https://github.com/gulpjs/vinyl) `File` object.
