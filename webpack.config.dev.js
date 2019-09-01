const merge = require('webpack-merge');
const globalConfig = require('./webpack.config.js');

// printing warning details to catch where throw it
process.traceDeprecation = true;

module.exports = merge(globalConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        historyApiFallback: true
    }
});