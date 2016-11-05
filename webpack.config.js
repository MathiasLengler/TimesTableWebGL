var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './build/index.js',
    output: {
        filename: 'bundle.js',
        path: './dist'
    },
    devtool: "source-map",
    resolve: {
        extensions: ['', '.js']
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }],
        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {test: /\.js$/, loader: "source-map-loader"}
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        title: "Times Table JS"
    })]
};