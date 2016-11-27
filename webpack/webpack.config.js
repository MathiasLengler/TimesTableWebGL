const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        "app": './src/index.ts',
        "vendor": ['three', 'stats.js', './node_modules/dat.gui/build/dat.gui.js']
    },
    output: {
        filename: 'bundle.js',
        path: './build'
    },
    devtool: "eval-source-map",
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    module: {
        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {test: /\.js$/, loader: "source-map-loader"}
        ],
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /dat.gui.js$/,
                loader: "script-loader"
            }
        ]
    }
    ,
    plugins: [
        new webpack.optimize.CommonsChunkPlugin(
            /* chunkName= */"vendor",
            /* filename= */"vendor.bundle.js"
        ),
        new HtmlWebpackPlugin({
            title: "Times Table JS"
        })
    ]
}
;