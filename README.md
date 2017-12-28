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

## Native Plugins

Several common/basic plugins are provided natively.

- **Reader** - Reads a file.
- **Writer** - Writes a file.
- **Copy** - Copies a file.

## Writing Plugins

Create a new javascript file which exports a module.

Each plugin has three core pieces:

1. The initialization step, in which custom configuration options are provided.
2. A flow execution step, which accepts per-file input/output to act on and returns a promise.
3. Promise resolution/rejection. Any resolution argument should pass along an object. `{ conf, filepath, result}`

```js
module.exports = function(opts) {
    return (flowObj) => {
        const { filepath, conf } = flowObj;

        return new Promise((resolve, reject) => {
            // resolve/reject here
            resolve({
                conf,
                filepath,
                result: 'something'
            });
        });
    };
};
```
