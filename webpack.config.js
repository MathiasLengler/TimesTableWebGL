const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve('./build/')
  },
  resolve: {
    extensions: ['.js', '.ts', ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/, loader: "ts-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  optimization: {
    splitChunks: {}
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "TimesTableWebGL"
    })
  ]
};