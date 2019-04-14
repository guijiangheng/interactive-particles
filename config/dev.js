const merge = require('webpack-merge');
const commonConfig = require('./common');

module.exports = merge(commonConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        open: true,
        overlay: true
    }
});