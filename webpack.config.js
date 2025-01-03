const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const dist = path.resolve(__dirname, "dist");

module.exports = (env, argv) => {
    const { mode } = argv;

    const isDevelopment = mode === "development";
    const isProduction = mode === "production";
    if (!isDevelopment && !isProduction) {
        throw new Error(`Unexpected mode: ${mode}`);
    }

    return {
        name: "app",
        entry: "./src/index.ts",
        output: {
            path: dist,
            filename: "app.js",
            publicPath: "",
            clean: true,
        },
        devServer: {
            static: {
                directory: dist,
            },
            client: {
                overlay: {
                    errors: true,
                    warnings: false,
                },
            },
            host: "0.0.0.0",
            hot: true,
        },
        devtool: isProduction ? "source-map" : "eval-source-map",
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".wasm"],
        },
        experiments: {
            topLevelAwait: true,
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, "res", "index.html"),
                favicon: "res/img/favicon.ico",
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                transpileOnly: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: [{ loader: "style-loader" }, { loader: "css-loader" }],
                },
                {
                    test: /\.(glsl|frag|vert)/,
                    type: "asset/source",
                },
            ],
        },
    };
};
