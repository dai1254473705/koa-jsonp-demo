var webpack = require("webpack");
var path = require("path");
var glob = require('glob');
// var HtmlWebpackPlugin = require('html-webpack-plugin');
var ROOT_PATH = path.resolve(__dirname,'./dist/js');
var BUILD_PATH = path.resolve(ROOT_PATH, '../es6js');

/**
 * 根据目录获取入口
 * @param  {[type]} globPath [description]
 * @return {[type]}          [description]
 */
function getEntry(globPath) {
    let entries = {};
    glob.sync(globPath).forEach(function(entry) {
        let basename = path.basename(entry, path.extname(entry)),
            pathname = path.dirname(entry);
        if (!entry.match(/js\/lib\//)) {
            entries[basename] = pathname + '/' + basename;
        }
    });
    return entries;
}

let entryJs = getEntry('./dist/js/*.js');


module.exports = {
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules')]
    },
    entry: entryJs,
    output: {
        path: BUILD_PATH,
        publicPath: BUILD_PATH,
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                loader: ["style-loader", "css-loader", "sass-loader", ]
            },
            {
                test: /\.js$/,
                loader: ["babel-loader?cacheDirectory"],
            },
            {
                test: /\.css$/,
                loader: ["style-loader", "css-loader"],
                include: path.resolve(__dirname, './src/es6/route')
            }
        ]
    },
    plugins: [
        /**
         * 抽出公共JS
         */
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            filename: "common.js",
            minChunks: 2,
        }),
        new webpack.optimize.UglifyJsPlugin()
        // new HtmlWebpackPlugin()
    ]
}