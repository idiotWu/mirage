const ip = require('ip');
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');

const joinRoot = path.join.bind(path, __dirname, '..');

module.exports = merge(baseConfig, {
  devtool: 'cheap-module-source-map',
  entry: [
    `webpack-dev-server/client?http://${ip.address()}:3000`,
    joinRoot('src/index.ts'),
  ],
  output: {
    path: joinRoot('.tmp'),
    filename: 'app.js',
    publicPath: '/',
  },
  module: {
    rules: [{
      test: /\.ts$/,
      enforce: 'pre',
      use: [{
        loader: 'tslint-loader',
        options: {
          // type check is slow, see
          // https://github.com/wbuchwalter/tslint-loader/issues/76
          // typeCheck: true,
          formatter: 'stylish',
        },
      }],
      include: [
        joinRoot('src'),
      ],
    }],
  },
});
