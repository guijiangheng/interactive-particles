const merge = require('webpack-merge');

module.exports = merge(require('./common'), {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'eslint-loader',
      },
      {
        test: /\.(png|jpg)$/,
        use: 'file-loader',
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
