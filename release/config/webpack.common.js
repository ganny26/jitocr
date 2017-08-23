var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
    entry: {
        app: './src/main.ts',
        vendor: './src/vendors.ts'
    },
    output: {
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
              test: /\.ts$/,
              loaders: [
                {
                  loader: 'awesome-typescript-loader',
                  options: { configFileName: helpers.root('src', 'tsconfig.json') }
                } , 'angular2-template-loader'
              ]
            },
            {
              test: /\.html$/,
              loader: 'html-loader'
            },
            {
              test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
              loader: 'file-loader?name=assets/[name].[hash].[ext]'
            },
            {
              test: /\.css$/,
              include: helpers.root('src', 'app'),
              loader: 'raw-loader'
            }
          ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
};