const merge = require('webpack-merge');
const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'eslint-loader',
      },
    ],
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    overlay: true,
  },
});
