const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    "app": './src/index.ts',
    "vendor": ['three', 'stats.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve('./build/')
  },
  devtool: "source-map",
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      "dat.gui": path.resolve(__dirname, 'lib/dat.gui/dat.gui')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        loader: "source-map-loader"
      },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader'
      },
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
  ,
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(
      {name: 'vendor', filename: 'vendor.bundle.js'}
    ),
    new HtmlWebpackPlugin({
      title: "TimesTableWebGL"
    })
  ]
}
;