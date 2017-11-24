const path = require('path');
const webpack = require('webpack');

const joinRoot = path.join.bind(path, __dirname, '..');

module.exports = {
  resolve: {
    extensions: ['.js', '.ts', '.css'],
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: ['ts-loader'],
      include: [
        joinRoot('src'),
      ],
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            plugins: () => [ require('autoprefixer') ],
          },
        },
      ],
      include: [
        joinRoot('src'),
      ],
    }],
  },
  stats: {
    modules: false,
  },
};
