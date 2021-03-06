/*eslint-env node*/
"use strict";

const Path = require("path");
const Webpack = require("webpack");
const Package = require("./package.json");
module.exports = {
    entry: Path.join(__dirname, "src", "index.js"),
    output: {
        path: Path.join(__dirname, ".public"),
        filename: "breadfishplusplus.js",
        chunkFilename: "[id].js",
        pathinfo: true,
        publicPath: "/"
    },
    externals: {
        "jquery": "jQuery"
    },
    module: {
        preLoaders: [{
            test: /\.jsx?$/,
            loader: "eslint-loader",
            include: [
                Path.join(__dirname, "src")
            ]
        }],
        loaders: [{
            test: /\.jsx?$/,
            include: [
                Path.join(__dirname, "src")
            ],
            loader: "babel-loader"
        }]
    },
    plugins: [
        new Webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // Don't load all moment locales
        new Webpack.DefinePlugin({
            BPP_VERSION: JSON.stringify(Package.version),
            BPP_CDN_DOMAIN: JSON.stringify(Package.domain.cdn),
            BPP_TS_DOMAIN: JSON.stringify(Package.domain.teamspeak),
            BPP_SCREENSHOT_DOMAIN: JSON.stringify(Package.domain.screenshot),
            DEBUG_MOE: true
        })
    ],
    devtool: "eval",
    watch: true,
    debug: true,
    resolve: {
        root: Path.join(__dirname, "src"),
        extensions: ["", ".js", ".jsx", ".json"],
        alias: {
            "eventEmitter/EventEmitter": "wolfy87-eventemitter"
        }
    }
};
