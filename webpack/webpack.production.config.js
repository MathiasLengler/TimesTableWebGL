var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: './dist'
    },
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Times Table JS"
        }),
        new webpack.optimize.UglifyJsPlugin()
    ]
};