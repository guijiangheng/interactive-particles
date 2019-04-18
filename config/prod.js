const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(require('./common'), {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 60000,
          },
        },
      },
    ],
  },
  output: {
    filename: '[name].[contenthash].js',
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
});
